import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, DollarSign, Calendar, Hash, Percent } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

export default function PaymentDetailsSection({ formData, onChange }) {
  const handleRemunerationPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const transferAmount = formData.transfer_amount || 0;
    const remunerationAmount = (transferAmount * percentage) / 100;
    const totalPayment = transferAmount + remunerationAmount;
    
    onChange({
      remuneration_percentage: percentage,
      remuneration_amount: remunerationAmount,
      total_payment_amount: totalPayment
    });
  };

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <FileText className="w-5 h-5 text-blue-900" />
          Payment Details & Terms
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Transfer Amount & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="transfer_amount" className="text-slate-700 font-medium">
              Transfer Amount *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="transfer_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.transfer_amount || ''}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0;
                  const remunerationAmount = (amount * (formData.remuneration_percentage || 0)) / 100;
                  onChange({ 
                    transfer_amount: amount,
                    remuneration_amount: remunerationAmount,
                    total_payment_amount: amount + remunerationAmount
                  });
                }}
                placeholder="0.00"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-slate-700 font-medium">
              Currency *
            </Label>
            <Select
              value={formData.currency || ''}
              onValueChange={(value) => onChange({ currency: value })}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Purpose */}
        <div className="space-y-2">
          <Label htmlFor="payment_purpose" className="text-slate-700 font-medium">
            Payment Purpose
          </Label>
          <Textarea
            id="payment_purpose"
            value={formData.payment_purpose || ''}
            onChange={(e) => onChange({ payment_purpose: e.target.value })}
            placeholder="Describe the purpose of this payment"
            className="border-slate-200 focus:border-blue-900 focus:ring-blue-900 min-h-[60px]"
          />
        </div>

        {/* Payment Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label htmlFor="payment_type" className="text-slate-700 font-medium">
              Payment Type
            </Label>
            <Select
              value={formData.payment_type || ''}
              onValueChange={(value) => onChange({ payment_type: value })}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="prepayment">Prepayment</SelectItem>
                <SelectItem value="partial_payment">Partial Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject_of_payment" className="text-slate-700 font-medium">
              Subject of Payment
            </Label>
            <Select
              value={formData.subject_of_payment || ''}
              onValueChange={(value) => onChange({ subject_of_payment: value })}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goods">Goods</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_basis" className="text-slate-700 font-medium">
              Document Basis
            </Label>
            <Select
              value={formData.document_basis || ''}
              onValueChange={(value) => onChange({ document_basis: value })}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="proforma_invoice">Proforma Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="document_number" className="text-slate-700 font-medium">
              Document Number
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="document_number"
                value={formData.document_number || ''}
                onChange={(e) => onChange({ document_number: e.target.value })}
                placeholder="Reference document number"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_date" className="text-slate-700 font-medium">
              Document Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="document_date"
                type="date"
                value={formData.document_date || ''}
                onChange={(e) => onChange({ document_date: e.target.value })}
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Remuneration Terms */}
        <div className="border-t pt-5 mt-5">
          <h4 className="font-semibold text-slate-800 mb-4">Terms of the Order</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="remuneration_percentage" className="text-slate-700 font-medium">
                Remuneration (% of Transfer Amount)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="remuneration_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.remuneration_percentage || ''}
                  onChange={(e) => handleRemunerationPercentageChange(e.target.value)}
                  placeholder="0.00"
                  className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Remuneration Amount
              </Label>
              <div className="h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center text-slate-700 font-semibold">
                {formData.currency ? `${CURRENCIES.find(c => c.code === formData.currency)?.symbol || ''} ` : ''}
                {(formData.remuneration_amount || 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-5 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Total Amount of Payment</span>
              <span className="text-2xl font-bold text-blue-900">
                {formData.currency ? `${CURRENCIES.find(c => c.code === formData.currency)?.symbol || ''} ` : ''}
                {(formData.total_payment_amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-700 font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any special instructions or additional information..."
            className="border-slate-200 focus:border-blue-900 focus:ring-blue-900 min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}