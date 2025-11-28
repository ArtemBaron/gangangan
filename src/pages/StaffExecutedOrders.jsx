import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { ArrowLeft, Search, Eye } from 'lucide-react';
import StaffExecutedDrawer from '@/components/staff/StaffExecutedDrawer';

export default function StaffExecutedOrders() {
  const [search, setSearch] = useState('');
  const [settledFilter, setSettledFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['staff-executed-orders'],
    queryFn: () => base44.entities.RemittanceOrder.list('-updated_date'),
  });

  const executedOrders = useMemo(() => {
    return orders.filter(o => o.status === 'released' || o.executed);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return executedOrders.filter(order => {
      if (settledFilter !== 'all' && order.settled !== settledFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return order.order_number?.toLowerCase().includes(s) ||
               order.client_name?.toLowerCase().includes(s) ||
               order.beneficiary_name?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [executedOrders, settledFilter, search]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RemittanceOrder.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-executed-orders'] });
      toast.success('Order updated');
    },
  });

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
      <header className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 border-b border-teal-800/50 shadow-lg sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('StaffDashboard')}>
              <Button variant="ghost" size="icon" className="text-teal-300 hover:text-white hover:bg-teal-800/50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69233f5a9a123941f81322f5/b1a1be267_gan.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">Executed Orders</h1>
            <Badge className="bg-emerald-600 shadow">{executedOrders.length}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Select value={settledFilter} onValueChange={setSettledFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by settled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Y">Settled</SelectItem>
              <SelectItem value="N">Not Settled</SelectItem>
              <SelectItem value="NA">N/A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="text-slate-300">Order ID</TableHead>
                <TableHead className="text-slate-300">Client</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Beneficiary</TableHead>
                <TableHead className="text-slate-300">Bank/BIC</TableHead>
                <TableHead className="text-slate-300">MT103</TableHead>
                <TableHead className="text-slate-300">Settled</TableHead>
                <TableHead className="text-slate-300">Refund</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center text-slate-400 py-8">Loading...</TableCell></TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-slate-400 py-8">No executed orders</TableCell></TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-slate-700 hover:bg-slate-750">
                  <TableCell className="text-white font-mono text-sm">{order.order_number}</TableCell>
                  <TableCell className="text-slate-300">{order.client_name || '-'}</TableCell>
                  <TableCell className="text-white font-medium">
                    {order.amount?.toLocaleString()} {order.currency}
                  </TableCell>
                  <TableCell className="text-slate-300 max-w-[150px] truncate">{order.beneficiary_name}</TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    <div>{order.bank_name?.slice(0, 20)}</div>
                    <div className="font-mono text-xs">{order.bic}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={order.mt103_status === 'sent' ? 'bg-green-600' : 'bg-slate-600'}>
                      {order.mt103_status === 'sent' ? 'Sent' : 'Not Sent'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      order.settled === 'Y' ? 'bg-green-600' : 
                      order.settled === 'N' ? 'bg-red-600' : 'bg-slate-600'
                    }>
                      {order.settled || 'NA'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={order.refund ? 'bg-orange-600' : 'bg-slate-600'}>
                      {order.refund ? 'Y' : 'N'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDrawer(order)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <StaffExecutedDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={(data) => {
          updateMutation.mutate({ id: selectedOrder.id, data });
        }}
      />
    </div>
  );
}