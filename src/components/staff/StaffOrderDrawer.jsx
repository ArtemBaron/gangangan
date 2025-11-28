import React, { useState, useEffect } from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import moment from 'moment';
import { AlertTriangle, FileText, CreditCard, Building2, User, Clock } from 'lucide-react';

const STATUSES = ['created', 'draft', 'check', 'rejected', 'pending_payment', 'on_execution', 'released', 'cancelled'];

export default function StaffOrderDrawer({ order, open, onClose, onUpdate }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'created',
        transaction_reference: order.transaction_reference || `${order.client_id || 'ID'}/${order.order_number}/`,
        transaction_remark: order.transaction_remark || '',
        invoice_flag: order.invoice_flag || false,
        invoice_number: order.invoice_number || '',
        invoice_received: order.invoice_received || false,
        payment_sent: order.payment_sent || false,
        payment_proof: order.payment_proof || false,
        date_payment_proof: order.date_payment_proof || '',
        remuneration_percent: order.remuneration_percent || '',
        sum_to_be_paid: order.sum_to_be_paid || '',
        currency_to_be_paid: order.currency_to_be_paid || order.currency || 'USD',
        non_mandiri_execution: order.non_mandiri_execution || false,
        closed: order.closed || false,
        executed: order.executed || false,
        staff_description: order.staff_description || ''
      });
    }
  }, [order]);

  if (!order) return null;

  const handleSave = () => {
    const updates = { ...formData };
    if (formData.status !== order.status) {
      updates.status_history = [...(order.status_history || []), { 
        status: formData.status, 
        timestamp: new Date().toISOString() 
      }];
    }
    onUpdate(updates);
    onClose();
  };

  const calculateSumToBePaid = () => {
    if (formData.remuneration_percent && order.amount) {
      const sum = order.amount * (1 + formData.remuneration_percent / 100);
      setFormData({ ...formData, sum_to_be_paid: Math.round(sum * 100) / 100 });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden bg-slate-900 border-slate-700 text-white p-0">
        <SheetHeader className="p-6 pb-4 border-b border-slate-700 bg-slate-800/50">
          <SheetTitle className="text-white flex items-center gap-3">
            <span className="font-mono text-lg">#{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
            {order.invoice_flag && (
              <Badge className="bg-amber-500 text-white">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Invoice Required
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Order Info (Read-only) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-medium">
                <FileText className="w-4 h-4" />
                Order Information
              </div>
              <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div className="text-slate-400">Client ID:</div>
                <div className="font-mono">{order.client_id || '-'}</div>
                <div className="text-slate-400">Client Name:</div>
                <div>{order.client_name || '-'}</div>
                <div className="text-slate-400">Amount:</div>
                <div className="font-semibold text-emerald-400">{order.amount?.toLocaleString()} {order.currency}</div>
                <div className="text-slate-400">Created:</div>
                <div>{moment(order.created_date).format('DD/MM/YYYY HH:mm')}</div>
                <div className="text-slate-400">Last Export:</div>
                <div>{order.last_download ? moment(order.last_download).format('DD/MM/YYYY HH:mm') : 'Never'}</div>
              </div>
            </div>

            {/* Beneficiary Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-medium">
                <User className="w-4 h-4" />
                Beneficiary
              </div>
              <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div className="text-slate-400">Name:</div>
                <div>{order.beneficiary_name}</div>
                <div className="text-slate-400">Address:</div>
                <div className="text-xs">{order.beneficiary_address}</div>
                <div className="text-slate-400">Account:</div>
                <div className="font-mono text-xs">{order.destination_account}</div>
              </div>
            </div>

            {/* Bank Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-400 text-sm font-medium">
                <Building2 className="w-4 h-4" />
                Bank Details
              </div>
              <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div className="text-slate-400">Bank:</div>
                <div>{order.bank_name}</div>
                <div className="text-slate-400">BIC/SWIFT:</div>
                <div className="font-mono">{order.bic}</div>
                <div className="text-slate-400">Country:</div>
                <div>{order.country_bank}</div>
                <div className="text-slate-400">Address:</div>
                <div className="text-xs">{order.bank_address}</div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
                <CreditCard className="w-4 h-4" />
                Staff Controls
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency to be Paid</Label>
                  <Select
                    value={formData.currency_to_be_paid}
                    onValueChange={(value) => setFormData({ ...formData, currency_to_be_paid: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                      <SelectItem value="IDR">IDR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transaction Reference</Label>
                <Input
                  value={formData.transaction_reference}
                  onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                  className="bg-slate-800 border-slate-600 font-mono"
                  placeholder="ID/10-92/"
                />
              </div>

              <div className="space-y-2">
                <Label>Transaction Remark</Label>
                <Textarea
                  value={formData.transaction_remark}
                  onChange={(e) => setFormData({ ...formData, transaction_remark: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Payment Proof</Label>
                  <Input
                    type="date"
                    value={formData.date_payment_proof}
                    onChange={(e) => setFormData({ ...formData, date_payment_proof: e.target.value })}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Remuneration (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.remuneration_percent}
                    onChange={(e) => setFormData({ ...formData, remuneration_percent: parseFloat(e.target.value) || '' })}
                    onBlur={calculateSumToBePaid}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Sum to be Paid</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.sum_to_be_paid}
                    onChange={(e) => setFormData({ ...formData, sum_to_be_paid: parseFloat(e.target.value) || '' })}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Invoice Flag</Label>
                  <Switch
                    checked={formData.invoice_flag}
                    onCheckedChange={(checked) => setFormData({ ...formData, invoice_flag: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Invoice Received</Label>
                  <Switch
                    checked={formData.invoice_received}
                    onCheckedChange={(checked) => setFormData({ ...formData, invoice_received: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Payment Sent</Label>
                  <Switch
                    checked={formData.payment_sent}
                    onCheckedChange={(checked) => setFormData({ ...formData, payment_sent: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Payment Proof</Label>
                  <Switch
                    checked={formData.payment_proof}
                    onCheckedChange={(checked) => setFormData({ ...formData, payment_proof: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Executed</Label>
                  <Switch
                    checked={formData.executed}
                    onCheckedChange={(checked) => setFormData({ ...formData, executed: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Closed</Label>
                  <Switch
                    checked={formData.closed}
                    onCheckedChange={(checked) => setFormData({ ...formData, closed: checked })}
                  />
                </div>
                <div className="flex items-center justify-between col-span-2">
                  <Label className="text-sm text-orange-400">Non-Mandiri Execution (exclude from TXT export)</Label>
                  <Switch
                    checked={formData.non_mandiri_execution}
                    onCheckedChange={(checked) => setFormData({ ...formData, non_mandiri_execution: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Staff Notes</Label>
                <Textarea
                  value={formData.staff_description}
                  onChange={(e) => setFormData({ ...formData, staff_description: e.target.value })}
                  className="bg-slate-800 border-slate-600"
                  placeholder="Internal notes..."
                  rows={2}
                />
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Status History
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {(order.status_history || []).slice().reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between text-sm bg-slate-800 rounded p-2">
                    <span className="capitalize">{entry.status?.replace('_', ' ')}</span>
                    <span className="text-slate-400">{moment(entry.timestamp).format('DD/MM/YY HH:mm')}</span>
                  </div>
                ))}
                {(!order.status_history || order.status_history.length === 0) && (
                  <div className="text-slate-500 text-sm text-center py-2">No history yet</div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-700">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}