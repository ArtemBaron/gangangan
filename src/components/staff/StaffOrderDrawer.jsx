import React, { useState, useEffect } from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import moment from 'moment';

const STATUSES = ['created', 'draft', 'check', 'rejected', 'pending_payment', 'on_execution', 'released', 'cancelled'];

export default function StaffOrderDrawer({ order, open, onClose, onUpdate }) {
  const [status, setStatus] = useState('');
  const [invoiceReceived, setInvoiceReceived] = useState(false);
  const [paymentProof, setPaymentProof] = useState(false);
  const [remunerationPercent, setRemunerationPercent] = useState('');
  const [sumToBePaid, setSumToBePaid] = useState('');
  const [currencyToBePaid, setCurrencyToBePaid] = useState('USD');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [staffDescription, setStaffDescription] = useState('');
  const [nonMandiri, setNonMandiri] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (order && open) {
      setStatus(order.status || 'created');
      setInvoiceReceived(order.invoice_received || false);
      setPaymentProof(order.payment_proof || false);
      setRemunerationPercent(order.remuneration_percent || '');
      setSumToBePaid(order.sum_to_be_paid || '');
      setCurrencyToBePaid(order.currency_to_be_paid || order.currency || 'USD');
      setInvoiceNumber(order.invoice_number || '');
      setStaffDescription(order.staff_description || '');
      setNonMandiri(order.non_mandiri_execution || false);
    }
  }, [order, open]);

  if (!order) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      status,
      invoice_received: invoiceReceived,
      payment_proof: paymentProof,
      remuneration_percent: remunerationPercent ? parseFloat(remunerationPercent) : null,
      sum_to_be_paid: sumToBePaid ? parseFloat(sumToBePaid) : null,
      currency_to_be_paid: currencyToBePaid,
      invoice_number: invoiceNumber,
      staff_description: staffDescription,
      non_mandiri_execution: nonMandiri
    };

    if (status !== order.status) {
      updates.status_history = [...(order.status_history || []), { 
        status, 
        timestamp: new Date().toISOString() 
      }];
    }

    onUpdate(updates);
    setIsSaving(false);
  };

  const calcSum = () => {
    if (remunerationPercent && order.amount) {
      const sum = order.amount * (1 + parseFloat(remunerationPercent) / 100);
      setSumToBePaid(Math.round(sum * 100) / 100);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl bg-slate-900 border-slate-700 text-white overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white flex items-center gap-3">
            #{order.order_number}
            <OrderStatusBadge status={order.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-20">
          {/* Info */}
          <div className="bg-slate-800 rounded p-3 text-sm space-y-1">
            <div><span className="text-slate-400">Client:</span> {order.client_name || order.client_id}</div>
            <div><span className="text-slate-400">Amount:</span> <span className="text-emerald-400 font-semibold">{order.amount?.toLocaleString()} {order.currency}</span></div>
            <div><span className="text-slate-400">Beneficiary:</span> {order.beneficiary_name}</div>
            <div><span className="text-slate-400">Bank:</span> {order.bank_name} ({order.bic})</div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded bg-slate-800 border border-slate-600 text-white"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={invoiceReceived} onCheckedChange={setInvoiceReceived} />
              <span className="text-sm">Invoice Received</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={paymentProof} onCheckedChange={setPaymentProof} />
              <span className="text-sm">Payment Proof</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={nonMandiri} onCheckedChange={setNonMandiri} />
              <span className="text-sm text-orange-400">Non-Mandiri</span>
            </label>
          </div>

          {/* Remuneration */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Remun %</Label>
              <Input
                type="number"
                value={remunerationPercent}
                onChange={(e) => setRemunerationPercent(e.target.value)}
                onBlur={calcSum}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sum to Pay</Label>
              <Input
                type="number"
                value={sumToBePaid}
                onChange={(e) => setSumToBePaid(e.target.value)}
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Currency</Label>
              <select
                value={currencyToBePaid}
                onChange={(e) => setCurrencyToBePaid(e.target.value)}
                className="w-full h-10 px-2 rounded bg-slate-800 border border-slate-600 text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
                <option value="IDR">IDR</option>
              </select>
            </div>
          </div>

          {/* Invoice Number */}
          <div className="space-y-1">
            <Label className="text-xs">Invoice Number</Label>
            <Input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="bg-slate-800 border-slate-600"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label className="text-xs">Staff Notes</Label>
            <Textarea
              value={staffDescription}
              onChange={(e) => setStaffDescription(e.target.value)}
              className="bg-slate-800 border-slate-600"
              rows={2}
            />
          </div>

          {/* History */}
          {order.status_history?.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">History</Label>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {order.status_history.slice().reverse().map((h, i) => (
                  <div key={i} className="flex justify-between text-xs bg-slate-800 rounded p-2">
                    <span>{h.status?.replace('_', ' ')}</span>
                    <span className="text-slate-500">{moment(h.timestamp).format('DD/MM HH:mm')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700 flex gap-3">
          <Button variant="outline" onClick={() => onClose(false)} className="flex-1 border-slate-600">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-teal-600 hover:bg-teal-700">
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}