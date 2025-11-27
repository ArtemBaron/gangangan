import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from 'lucide-react';
import moment from 'moment';
import OrderStatusBadge from './OrderStatusBadge';
import { generateCSVData, downloadCSV } from '../remittance/utils/csvGenerator';
import { toast } from 'sonner';

function maskAccount(account) {
  if (!account || account.length < 8) return account;
  return account.slice(0, 4) + '****' + account.slice(-4);
}

function truncateText(text, maxLength = 30) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function OrdersTable({ orders, onViewDetails }) {
  const handleDownloadCSV = (order, e) => {
    e.stopPropagation();
    const csvData = generateCSVData(order);
    downloadCSV(csvData, `order_${order.order_number}.csv`);
    toast.success('CSV downloaded');
  };

  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Beneficiary</TableHead>
              <TableHead className="font-semibold">Account</TableHead>
              <TableHead className="font-semibold">Bank/BIC</TableHead>
              <TableHead className="font-semibold">Remark</TableHead>
              <TableHead className="font-semibold text-center">Invoice</TableHead>
              <TableHead className="font-semibold text-center">Payment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Updated</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => onViewDetails(order)}
              >
                <TableCell className="font-mono text-sm font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {moment(order.created_date).format('DD/MM/YY')}
                </TableCell>
                <TableCell className="font-medium">
                  {order.amount?.toLocaleString()} {order.currency}
                </TableCell>
                <TableCell className="text-sm">
                  {truncateText(order.beneficiary_name, 20)}
                </TableCell>
                <TableCell className="font-mono text-sm text-slate-600">
                  {maskAccount(order.destination_account)}
                </TableCell>
                <TableCell className="text-sm">
                  <div>{truncateText(order.bank_name, 15)}</div>
                  <div className="text-xs text-slate-500 font-mono">{order.bic}</div>
                </TableCell>
                <TableCell className="text-sm text-slate-600 max-w-[150px]">
                  {truncateText(order.transaction_remark, 25)}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block w-6 h-6 rounded-full text-xs font-medium leading-6 ${
                    order.invoice_received ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.invoice_received ? 'Y' : 'N'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block w-6 h-6 rounded-full text-xs font-medium leading-6 ${
                    order.payment_sent ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.payment_sent ? 'Y' : 'N'}
                  </span>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {moment(order.updated_date).format('DD/MM/YY')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(order);
                      }}
                      className="h-8 w-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDownloadCSV(order, e)}
                      className="h-8 w-8"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}