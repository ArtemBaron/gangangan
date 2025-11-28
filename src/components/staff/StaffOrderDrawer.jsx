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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import moment from 'moment';

const STATUSES = ['draft', 'check', 'rejected', 'pending_payment', 'on_execution', 'released'];

export default function StaffOrderDrawer({ order, open, onClose, onUpdate }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        transaction_reference: order.transaction_reference || `${order.client_id || 'ID'}/${order.order_number}/`,
        invoice_number: order.invoice_number || '',
        invoice_received: order.invoice_received || false,
        payment_proof: order.payment_proof || false,
        date_payment_proof: order.date_payment_proof || '',
        remuneration_percent: order.remuneration_percent || '',
        sum_to_be_paid: order.sum_to_be_paid || '',
        currency_to_be_paid: order.currency_to_be_paid || order.currency,
        non_mandiri_execution: order.non_mandiri_execution || false,
        status: order.status
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-3">
            Order #{order.order_number}
            <OrderStatusBadge status={order.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Info (Read-only) */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-400">Client:</div>
              <div>{order.client_name || '-'}</div>
              <div className="text-slate-400">Amount:</div>
              <div className="font-medium">{order.amount?.toLocaleString()} {order.currency}</div>
              <div className="text-slate-400">Beneficiary:</div>
              <div>{order.beneficiary_name}</div>
              <div className="text-slate-400">Bank:</div>
              <div>{order.bank_name} ({order.bic})</div>
              <div className="text-slate-400">Account:</div>
              <div className="font-mono text-xs">{order.destination_account}</div>
              <div className="text-slate-400">Created:</div>
              <div>{moment(order.created_date).format('DD/MM/YYYY HH:mm')}</div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Editable Fields */}
          <div className="space-y-4">
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
              <Label>Transaction Reference</Label>
              <Input
                value={formData.transaction_reference}
                onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                className="bg-slate-800 border-slate-600 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                className="bg-slate-800 border-slate-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Invoice Received</Label>
              <Switch
                checked={formData.invoice_received}
                onCheckedChange={(checked) => setFormData({ ...formData, invoice_received: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Payment Proof Received</Label>
              <Switch
                checked={formData.payment_proof}
                onCheckedChange={(checked) => setFormData({ ...formData, payment_proof: checked })}
              />
            </div>

            {formData.payment_proof && (
              <div className="space-y-2">
                <Label>Date of Payment Proof</Label>
                <Input
                  type="date"
                  value={formData.date_payment_proof}
                  onChange={(e) => setFormData({ ...formData, date_payment_proof: e.target.value })}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
            )}

            <Separator className="bg-slate-700" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Remuneration (%)</Label>
                <Input
                  type="number"
                  value={formData.remuneration_percent}
                  onChange={(e) => setFormData({ ...formData, remuneration_percent: parseFloat(e.target.value) })}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Sum to be Paid</Label>
                <Input
                  type="number"
                  value={formData.sum_to_be_paid}
                  onChange={(e) => setFormData({ ...formData, sum_to_be_paid: parseFloat(e.target.value) })}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Non-Mandiri Execution</Label>
              <Switch
                checked={formData.non_mandiri_execution}
                onCheckedChange={(checked) => setFormData({ ...formData, non_mandiri_execution: checked })}
              />
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Timeline */}
          <div>
            <Label className="mb-3 block">Status History</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(order.status_history || []).map((entry, i) => (
                <div key={i} className="flex justify-between text-sm bg-slate-800 rounded p-2">
                  <span className="capitalize">{entry.status?.replace('_', ' ')}</span>
                  <span className="text-slate-400">{moment(entry.timestamp).format('DD/MM/YY HH:mm')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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