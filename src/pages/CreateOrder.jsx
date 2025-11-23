import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import CustomerSection from '../components/remittance/CustomerSection';
import BeneficiarySection from '../components/remittance/BeneficiarySection';
import PaymentDetailsSection from '../components/remittance/PaymentDetailsSection';
import OrderSummary from '../components/remittance/OrderSummary';
import { Send } from 'lucide-react';

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    order_number: '',
    order_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    transfer_amount: 0,
    currency: 'USD',
    beneficiary_name: '',
    beneficiary_address: '',
    beneficiary_country: '',
    beneficiary_registration_number: '',
    beneficiary_bank: '',
    bic: '',
    bank_address: '',
    account_number: '',
    payment_purpose: '',
    payment_type: '',
    subject_of_payment: '',
    document_basis: '',
    document_number: '',
    document_date: '',
    remuneration_percentage: 2.5,
    remuneration_amount: 0,
    total_payment_amount: 0,
    notes: ''
  });

  // Generate order number on component mount
  useEffect(() => {
    if (!formData.order_number) {
      const orderNumber = `FTO-${Date.now().toString().slice(-8)}`;
      setFormData(prev => ({ ...prev, order_number: orderNumber }));
    }
  }, []);

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      return await base44.entities.RemittanceOrder.create({
        ...orderData,
        status: 'pending'
      });
    },
    onSuccess: (data) => {
      toast.success('Order created successfully!', {
        description: `Order number: ${data.order_number}`
      });
      
      // Reset form
      const newOrderNumber = `FTO-${Date.now().toString().slice(-8)}`;
      setFormData({
        order_number: newOrderNumber,
        order_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        transfer_amount: 0,
        currency: 'USD',
        beneficiary_name: '',
        beneficiary_address: '',
        beneficiary_country: '',
        beneficiary_registration_number: '',
        beneficiary_bank: '',
        bic: '',
        bank_address: '',
        account_number: '',
        payment_purpose: '',
        payment_type: '',
        subject_of_payment: '',
        document_basis: '',
        document_number: '',
        document_date: '',
        remuneration_percentage: 2.5,
        remuneration_amount: 0,
        total_payment_amount: 0,
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
              <h1 className="text-3xl font-bold tracking-tight">Fund Transfer Order</h1>
              <p className="text-blue-100 mt-1">Professional international fund transfer service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerSection 
              formData={formData} 
              onChange={handleFormChange}
            />
            
            <BeneficiarySection 
              formData={formData} 
              onChange={handleFormChange}
            />
            
            <PaymentDetailsSection 
              formData={formData} 
              onChange={handleFormChange}
            />
          </div>

          {/* Summary - Right Column */}
          <div className="lg:col-span-1">
            <OrderSummary 
              formData={formData}
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