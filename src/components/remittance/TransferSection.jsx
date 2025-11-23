import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightLeft, DollarSign, FileText, Wallet } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' }
];

const PURPOSES = [
  'Business Payment',
  'Supplier Payment',
  'Employee Salary',
  'Contract Payment',
  'Investment',
  'Other Business Purpose'
];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'business_account', label: 'Business Account' }
];

export default function TransferSection({ formData, onChange, calculations }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <ArrowRightLeft className="w-5 h-5 text-blue-900" />
          Transfer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="send_amount" className="text-slate-700 font-medium">
              You Send *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="send_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.send_amount || ''}
                onChange={(e) => onChange({ send_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send_currency" className="text-slate-700 font-medium">
              Currency *
            </Label>
            <Select
              value={formData.send_currency || ''}
              onValueChange={(value) => onChange({ send_currency: value })}
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

        {formData.send_currency && formData.send_amount > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-600">Exchange Rate</span>
              <span className="font-semibold text-blue-900">
                1 {formData.send_currency} = {calculations.exchange_rate.toFixed(4)} {formData.receive_currency || '...'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Transfer Fee</span>
              <span className="font-semibold text-slate-800">
                {CURRENCIES.find(c => c.code === formData.send_currency)?.symbol || ''}{calculations.transfer_fee.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="receive_currency" className="text-slate-700 font-medium">
              Recipient Gets *
            </Label>
            <Select
              value={formData.receive_currency || ''}
              onValueChange={(value) => onChange({ receive_currency: value })}
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

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              Recipient Receives
            </Label>
            <div className="h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md flex items-center text-slate-700 font-semibold">
              {formData.receive_currency && calculations.receive_amount > 0
                ? `${CURRENCIES.find(c => c.code === formData.receive_currency)?.symbol || ''} ${calculations.receive_amount.toFixed(2)}`
                : '0.00'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose" className="text-slate-700 font-medium">
            Purpose of Transfer
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Select
              value={formData.purpose || ''}
              onValueChange={(value) => onChange({ purpose: value })}
            >
              <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {PURPOSES.map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method" className="text-slate-700 font-medium">
            Payment Method
          </Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Select
              value={formData.payment_method || ''}
              onValueChange={(value) => onChange({ payment_method: value })}
            >
              <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-700 font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any special instructions or notes..."
            className="border-slate-200 focus:border-blue-900 focus:ring-blue-900 min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}