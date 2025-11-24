import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertCircle, Eye } from 'lucide-react';
import { validateLatinText, buildRemarkFromTemplate } from './utils/validators';

const DEFAULT_TEMPLATE = '{PAYMENT} for {GOODS} under {TYPE} {INV_NO} dd {DATE}';

export default function TransactionRemarkSection({ formData, onChange, errors, setErrors }) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (formData.transaction_remark_mode === 'template') {
      const tokens = {
        INV_NO: formData.remark_inv_no,
        DATE: formData.remark_date,
        GOODS: formData.remark_goods,
        TYPE: formData.remark_type,
        PAYMENT: formData.remark_payment
      };
      
      const result = buildRemarkFromTemplate(DEFAULT_TEMPLATE, tokens);
      setPreview(result.remark);
      onChange({ transaction_remark: result.remark });
      
      if (result.errors.length > 0) {
        setErrors(prev => ({
          ...prev,
          transaction_remark: result.errors.join('; ')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          transaction_remark: null
        }));
      }
    }
  }, [
    formData.transaction_remark_mode,
    formData.remark_inv_no,
    formData.remark_date,
    formData.remark_goods,
    formData.remark_type,
    formData.remark_payment
  ]);

  const handleManualChange = (value) => {
    onChange({ transaction_remark: value });
    
    const validation = validateLatinText(value, 500);
    setErrors(prev => ({
      ...prev,
      transaction_remark: validation.valid ? null : validation.error
    }));
  };

  const handleModeChange = (mode) => {
    onChange({ 
      transaction_remark_mode: mode,
      transaction_remark: mode === 'manual' ? '' : preview
    });
    setErrors(prev => ({
      ...prev,
      transaction_remark: null
    }));
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <FileText className="w-5 h-5 text-blue-900" />
          Transaction Remark
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <Tabs value={formData.transaction_remark_mode || 'template'} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
        </Tabs>

        {formData.transaction_remark_mode === 'manual' ? (
          <div className="space-y-2">
            <Label htmlFor="transaction_remark" className="text-slate-700 font-medium">
              Transaction Remark *
              <span className="text-xs text-slate-500 ml-2">(Max 500 chars)</span>
            </Label>
            <Textarea
              id="transaction_remark"
              value={formData.transaction_remark || ''}
              onChange={(e) => handleManualChange(e.target.value)}
              placeholder="Enter transaction remark..."
              className={`border-slate-200 focus:border-blue-900 focus:ring-blue-900 min-h-[100px] ${errors.transaction_remark ? 'border-red-500' : ''}`}
              maxLength={500}
              required
            />
            {errors.transaction_remark && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.transaction_remark}</span>
              </div>
            )}
            <div className="text-xs text-slate-500">
              {formData.transaction_remark?.length || 0} / 500 characters
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Template:</div>
              <code className="text-sm text-slate-800">{DEFAULT_TEMPLATE}</code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inv_no" className="text-slate-700 font-medium">
                  Invoice Number * {'{INV_NO}'}
                </Label>
                <Input
                  id="inv_no"
                  value={formData.remark_inv_no || ''}
                  onChange={(e) => onChange({ remark_inv_no: e.target.value })}
                  placeholder="e.g., 24543"
                  className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                  maxLength={32}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remark_date" className="text-slate-700 font-medium">
                  Invoice Date * {'{DATE}'}
                </Label>
                <Input
                  id="remark_date"
                  type="date"
                  value={formData.remark_date || ''}
                  onChange={(e) => onChange({ remark_date: e.target.value })}
                  className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                  required
                />
                <div className="text-xs text-slate-500">Format: DD/MM/YYYY in output</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goods" className="text-slate-700 font-medium">
                  Goods {'{GOODS}'}
                </Label>
                <Input
                  id="goods"
                  value={formData.remark_goods || 'goods'}
                  onChange={(e) => onChange({ remark_goods: e.target.value })}
                  placeholder="goods"
                  className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                  maxLength={40}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-700 font-medium">
                  Document Type {'{TYPE}'}
                </Label>
                <Input
                  id="type"
                  value={formData.remark_type || 'inv'}
                  onChange={(e) => onChange({ remark_type: e.target.value })}
                  placeholder="inv, invoice, contract, proforma invoice"
                  className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment" className="text-slate-700 font-medium">
                  Payment Type {'{PAYMENT}'}
                </Label>
                <Input
                  id="payment"
                  value={formData.remark_payment || 'Payment'}
                  onChange={(e) => onChange({ remark_payment: e.target.value })}
                  placeholder="Payment, partial payment"
                  className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">Preview:</span>
              </div>
              <div className="text-sm text-slate-800 bg-white p-3 rounded border border-blue-100">
                {preview || 'Fill in the required fields to see preview...'}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {preview.length} / 500 characters
              </div>
            </div>

            {errors.transaction_remark && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.transaction_remark}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}