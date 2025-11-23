import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function OrderSummary({ formData, calculations, onSubmit, isSubmitting }) {
  const getCurrencySymbol = (code) => {
    const currencies = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'NGN': '₦', 'KES': 'KSh',
      'GHS': 'GH₵', 'ZAR': 'R', 'INR': '₹', 'PHP': '₱', 'MXN': 'MX$'
    };
    return currencies[code] || code;
  };

  const isValid = formData.customer_name && 
                  formData.beneficiary_name && 
                  formData.transfer_amount > 0 && 
                  formData.currency;

  return (
    <Card className="border-2 border-blue-900 shadow-lg sticky top-6">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 text-white">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-600 text-sm">Transfer Amount</span>
            <span className="font-semibold text-lg text-slate-800">
              {getCurrencySymbol(formData.currency)} {formData.transfer_amount?.toFixed(2) || '0.00'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Remuneration ({formData.remuneration_percentage || 0}%)</span>
            <span className="text-slate-700">
              {getCurrencySymbol(formData.currency)} {(formData.remuneration_amount || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t-2 border-slate-300">
            <span className="font-semibold text-slate-700">Total Payment Amount</span>
            <span className="font-bold text-xl text-blue-900">
              {getCurrencySymbol(formData.currency)} {(formData.total_payment_amount || 0).toFixed(2)}
            </span>
          </div>

          {formData.order_number && (
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-3 mt-4">
              <div className="text-xs text-slate-600 mb-1">Order Number</div>
              <div className="font-mono font-semibold text-slate-800">{formData.order_number}</div>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Create Order
              </>
            )}
          </Button>
          
          {!isValid && (
            <p className="text-xs text-center text-slate-500">
              Please fill in all required fields (*)
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-500">
          <p className="flex items-start gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Secure and encrypted transfer</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Funds delivered within 24-48 hours</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-emerald-600">✓</span>
            <span>Real-time order tracking</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}