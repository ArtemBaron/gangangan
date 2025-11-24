import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, AlertCircle, Eye, Plus, X } from 'lucide-react';
import { validateLatinText, buildRemarkFromTemplate } from './utils/validators';

const DEFAULT_TEMPLATE = '{PAYMENT} for {GOODS} under {TYPE} {INV_NO} dd {DATE}';

const DEFAULT_DOCUMENT_TYPES = [
  { value: 'inv', label: 'Invoice' },
  { value: 'invoice', label: 'Invoice (full)' },
  { value: 'contract', label: 'Contract' },
  { value: 'proforma invoice', label: 'Proforma Invoice' }
];

export default function TransactionRemarkSection({ formData, onChange, errors, setErrors }) {
  const [preview, setPreview] = useState('');
  const [documentTypes, setDocumentTypes] = useState(DEFAULT_DOCUMENT_TYPES);
  const [newDocType, setNewDocType] = useState('');
  const [showAddType, setShowAddType] = useState(false);

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

  const handleAddDocType = () => {
    if (newDocType.trim()) {
      const value = newDocType.trim().toLowerCase();
      const label = newDocType.trim();
      
      if (!documentTypes.find(dt => dt.value === value)) {
        setDocumentTypes([...documentTypes, { value, label }]);
        onChange({ remark_type: value });
        setNewDocType('');
        setShowAddType(false);
      }
    }
  };

  const handleRemoveDocType = (value) => {
    if (!DEFAULT_DOCUMENT_TYPES.find(dt => dt.value === value)) {
      setDocumentTypes(documentTypes.filter(dt => dt.value !== value));
      if (formData.remark_type === value) {
        onChange({ remark_type: 'inv' });
      }
    }
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
                <Label className="text-slate-700 font-medium">
                  Document Type {'{TYPE}'}
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={formData.remark_type || 'inv'}
                      onValueChange={(value) => onChange({ remark_type: value })}
                    >
                      <SelectTrigger className="flex-1 border-slate-200 focus:border-blue-900 focus:ring-blue-900">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((docType) => (
                          <SelectItem key={docType.value} value={docType.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{docType.label}</span>
                              {!DEFAULT_DOCUMENT_TYPES.find(dt => dt.value === docType.value) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveDocType(docType.value);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowAddType(!showAddType)}
                      className="border-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showAddType && (
                    <div className="flex gap-2">
                      <Input
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value)}
                        placeholder="Enter new document type..."
                        className="border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDocType();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddDocType}
                        size="sm"
                        className="bg-blue-900 hover:bg-blue-800"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowAddType(false);
                          setNewDocType('');
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
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