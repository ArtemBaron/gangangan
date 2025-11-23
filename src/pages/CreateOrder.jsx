import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import SenderSection from '../components/remittance/SenderSection';
import BeneficiarySection from '../components/remittance/BeneficiarySection';
import TransferSection from '../components/remittance/TransferSection';
import OrderSummary from '../components/remittance/OrderSummary';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    sender_business_name: '',
    sender_contact_person: '',
    sender_email: '',
    sender_phone: '',
    sender_country: '',
    beneficiary_name: '',
    beneficiary_account: '',
    beneficiary_bank: '',
    beneficiary_country: '',
    beneficiary_phone: '',
    send_amount: 0,
    send_currency: 'USD',
    receive_currency: 'NGN',
    purpose: '',
    payment_method: '',
    notes: ''
  });

  // Calculate exchange rate, fees, and totals
  const calculateTransfer = () => {
    const baseRates = {
      'USD-NGN': 1550.50, 'USD-KES': 152.30, 'USD-GHS': 15.40,
      'EUR-NGN': 1680.20, 'EUR-KES': 165.80, 'EUR-GHS': 16.70,
      'GBP-NGN': 1950.00, 'GBP-KES': 192.50, 'GBP-GHS': 19.40,
      'USD-EUR': 0.92, 'USD-GBP': 0.79, 'EUR-USD': 1.09,
      'EUR-GBP': 0.86, 'GBP-USD': 1.27, 'GBP-EUR': 1.16
    };

    const key = `${formData.send_currency}-${formData.receive_currency}`;
    const reverseKey = `${formData.receive_currency}-${formData.send_currency}`;
    
    let rate = baseRates[key] || (baseRates[reverseKey] ? 1 / baseRates[reverseKey] : 1);
    
    // If same currency
    if (formData.send_currency === formData.receive_currency) {
      rate = 1;
    }

    const amount = formData.send_amount || 0;
    const feePercentage = 0.025; // 2.5% fee
    const minFee = 5;
    const fee = Math.max(amount * feePercentage, minFee);
    const totalCost = amount + fee;
    const receiveAmount = amount * rate;

    return {
      exchange_rate: rate,
      transfer_fee: fee,
      total_cost: totalCost,
      receive_amount: receiveAmount
    };
  };

  const calculations = calculateTransfer();

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const fullOrderData = {
        ...orderData,
        order_number: orderNumber,
        exchange_rate: calculations.exchange_rate,
        transfer_fee: calculations.transfer_fee,
        total_cost: calculations.total_cost,
        receive_amount: calculations.receive_amount,
        status: 'pending'
      };

      return await base44.entities.RemittanceOrder.create(fullOrderData);
    },
    onSuccess: (data) => {
      toast.success('Order created successfully!', {
        description: `Order number: ${data.order_number}`
      });
      
      // Reset form
      setFormData({
        sender_business_name: '',
        sender_contact_person: '',
        sender_email: '',
        sender_phone: '',
        sender_country: '',
        beneficiary_name: '',
        beneficiary_account: '',
        beneficiary_bank: '',
        beneficiary_country: '',
        beneficiary_phone: '',
        send_amount: 0,
        send_currency: 'USD',
        receive_currency: 'NGN',
        purpose: '',
        payment_method: '',
        notes: ''
      });
    },
    onError: (error) => {
      toast.error('Failed to create order', {
        description: error.message
      });
    }
  });

  const handleSubmit = () => {
    createOrderMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Remittance Order</h1>
              <p className="text-blue-100 mt-1">Fast, secure, and transparent international transfers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <SenderSection 
              formData={formData} 
              onChange={handleFormChange}
            />
            
            <BeneficiarySection 
              formData={formData} 
              onChange={handleFormChange}
            />
            
            <TransferSection 
              formData={formData} 
              onChange={handleFormChange}
              calculations={calculations}
            />
          </div>

          {/* Summary - Right Column */}
          <div className="lg:col-span-1">
            <OrderSummary 
              formData={formData}
              calculations={calculations}
              onSubmit={handleSubmit}
              isSubmitting={createOrderMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-1">150+</div>
              <div className="text-sm text-slate-600">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-1">24/7</div>
              <div className="text-sm text-slate-600">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-1">$2B+</div>
              <div className="text-sm text-slate-600">Transferred Annually</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}