import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Search, FileDown, CheckCircle, Trash2, MoreVertical, Eye, AlertTriangle, X } from 'lucide-react';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import StaffOrderDrawer from '@/components/staff/StaffOrderDrawer';
import { generateTxtInstruction } from '@/components/staff/utils/instructionGenerator';
import moment from 'moment';

const ACTIVE_STATUSES = ['created', 'draft', 'check', 'pending_payment', 'on_execution'];
const ALL_STATUSES = ['created', 'draft', 'check', 'rejected', 'pending_payment', 'on_execution', 'released', 'cancelled'];

export default function StaffActiveOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['staff-active-orders'],
    queryFn: () => base44.entities.RemittanceOrder.list('-created_date'),
  });

  const activeOrders = useMemo(() => {
    return orders.filter(o => ACTIVE_STATUSES.includes(o.status) && !o.closed && !o.executed);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (currencyFilter !== 'all' && order.currency !== currencyFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return order.order_number?.toLowerCase().includes(s) ||
               order.client_name?.toLowerCase().includes(s) ||
               order.client_id?.toLowerCase().includes(s) ||
               order.beneficiary_name?.toLowerCase().includes(s) ||
               order.bic?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeOrders, statusFilter, currencyFilter, search]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RemittanceOrder.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-active-orders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => base44.entities.RemittanceOrder.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-active-orders'] });
      toast.success('Orders deleted');
      setSelectedIds(new Set());
      setDeleteDialogOpen(false);
    },
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id, checked) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleStatusChange = (order, newStatus) => {
    const history = [...(order.status_history || []), { status: newStatus, timestamp: new Date().toISOString() }];
    updateMutation.mutate({
      id: order.id,
      data: { status: newStatus, status_history: history }
    });
    toast.success(`Status changed to ${newStatus}`);
  };

  const handleCreateInstruction = () => {
    const selectedOrders = filteredOrders.filter(o => selectedIds.has(o.id) && !o.non_mandiri_execution);
    if (selectedOrders.length === 0) {
      toast.error('No valid orders selected (non-Mandiri orders excluded)');
      return;
    }

    const txtContent = selectedOrders.map(o => generateTxtInstruction(o)).join('\n');
    const filename = `${new Date().toISOString().slice(0,10).replace(/-/g,'')}_instruction.txt`;
    
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    selectedOrders.forEach(order => {
      updateMutation.mutate({
        id: order.id,
        data: { 
          last_download: new Date().toISOString(),
          status_history: [...(order.status_history || []), { 
            status: 'instruction_exported', 
            timestamp: new Date().toISOString() 
          }]
        }
      });
    });

    toast.success(`Instruction file created for ${selectedOrders.length} orders`);
    setSelectedIds(new Set());
  };

  const handleMarkAsExecuted = () => {
    const selectedOrders = filteredOrders.filter(o => selectedIds.has(o.id));
    if (selectedOrders.length === 0) {
      toast.error('No orders selected');
      return;
    }

    selectedOrders.forEach(order => {
      updateMutation.mutate({
        id: order.id,
        data: { 
          status: 'released',
          executed: true,
          status_history: [...(order.status_history || []), { status: 'released', timestamp: new Date().toISOString() }]
        }
      });
    });

    toast.success(`${selectedOrders.length} orders marked as executed`);
    setSelectedIds(new Set());
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
      <header className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 border-b border-teal-800/50 shadow-lg sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('StaffDashboard')}>
                <Button variant="ghost" size="icon" className="text-teal-300 hover:text-white hover:bg-teal-800/50">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69233f5a9a123941f81322f5/b1a1be267_gan.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-bold text-white">Active Orders</h1>
              <Badge className="bg-orange-500 shadow">{activeOrders.length}</Badge>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <>
                  <span className="text-slate-400 text-sm">{selectedIds.size} selected</span>
                  <Button onClick={handleCreateInstruction} className="bg-teal-600 hover:bg-teal-700">
                    <FileDown className="w-4 h-4 mr-2" />
                    Create TXT Instruction
                  </Button>
                  <Button onClick={handleMarkAsExecuted} className="bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Executed
                  </Button>
                  <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by order, client, beneficiary, BIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ACTIVE_STATUSES.map(s => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="CNY">CNY</SelectItem>
              <SelectItem value="IDR">IDR</SelectItem>
            </SelectContent>
          </Select>
          {(statusFilter !== 'all' || currencyFilter !== 'all' || search) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setStatusFilter('all'); setCurrencyFilter('all'); setSearch(''); }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-slate-300">Order ID</TableHead>
                <TableHead className="text-slate-300">Client</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Beneficiary</TableHead>
                <TableHead className="text-slate-300">Account</TableHead>
                <TableHead className="text-slate-300">Bank/BIC</TableHead>
                <TableHead className="text-slate-300">Remark</TableHead>
                <TableHead className="text-slate-300">Inv</TableHead>
                <TableHead className="text-slate-300">Pay</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Last Export</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={13} className="text-center text-slate-400 py-8">Loading...</TableCell></TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={13} className="text-center text-slate-400 py-8">No active orders</TableCell></TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className={`border-slate-700 hover:bg-slate-750 ${order.non_mandiri_execution ? 'opacity-60' : ''}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={(checked) => handleSelectOne(order.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-white font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {order.order_number}
                      {order.invoice_flag && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      {order.non_mandiri_execution && <Badge className="bg-slate-600 text-xs">Non-M</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="text-sm">{order.client_name || '-'}</div>
                    <div className="text-xs text-slate-500 font-mono">{order.client_id}</div>
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {order.amount?.toLocaleString()} {order.currency}
                  </TableCell>
                  <TableCell className="text-slate-300 max-w-[120px]">
                    <div className="truncate text-sm">{order.beneficiary_name}</div>
                    <div className="text-xs text-slate-500 truncate">{order.beneficiary_address?.slice(0, 30)}</div>
                  </TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs max-w-[100px] truncate">
                    {order.destination_account}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    <div className="truncate max-w-[100px]">{order.bank_name}</div>
                    <div className="font-mono text-xs">{order.bic}</div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs max-w-[120px] truncate">
                    {order.transaction_remark?.slice(0, 40)}
                  </TableCell>
                  <TableCell>
                    <Badge className={order.invoice_received ? 'bg-emerald-600' : 'bg-slate-600'}>
                      {order.invoice_received ? 'Y' : 'N'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={order.payment_proof ? 'bg-emerald-600' : 'bg-slate-600'}>
                      {order.payment_proof ? 'Y' : 'N'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {order.last_download ? moment(order.last_download).format('DD/MM/YY HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => openDrawer(order)} className="text-white hover:bg-slate-700">
                          <Eye className="w-4 h-4 mr-2" /> View / Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        {ALL_STATUSES.map(s => (
                          <DropdownMenuItem 
                            key={s}
                            onClick={() => handleStatusChange(order, s)} 
                            className={`text-white hover:bg-slate-700 ${order.status === s ? 'bg-slate-700' : ''}`}
                          >
                            Set: {s.replace('_', ' ').toUpperCase()}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <StaffOrderDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={(data) => {
          updateMutation.mutate({ id: selectedOrder.id, data });
          toast.success('Order updated');
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Order(s)</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete the selected orders? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate([...selectedIds])}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}