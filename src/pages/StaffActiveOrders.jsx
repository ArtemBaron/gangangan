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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Search, FileDown, CheckCircle, Trash2, MoreVertical, Eye } from 'lucide-react';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import StaffOrderDrawer from '@/components/staff/StaffOrderDrawer';
import { generateTxtInstruction } from '@/components/staff/utils/instructionGenerator';

const ACTIVE_STATUSES = ['created', 'draft', 'check', 'pending_payment', 'on_execution'];

export default function StaffActiveOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      if (search) {
        const s = search.toLowerCase();
        return order.order_number?.toLowerCase().includes(s) ||
               order.client_name?.toLowerCase().includes(s) ||
               order.beneficiary_name?.toLowerCase().includes(s) ||
               order.bic?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeOrders, statusFilter, search]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RemittanceOrder.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-active-orders'] }),
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredOrders.filter(o => !o.non_mandiri_execution).map(o => o.id)));
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
      toast.error('No valid orders selected');
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

    // Update last_download for all selected orders
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

  const handleDeleteSelected = () => {
    const selectedOrders = filteredOrders.filter(o => selectedIds.has(o.id));
    selectedOrders.forEach(order => {
      base44.entities.RemittanceOrder.delete(order.id);
    });
    queryClient.invalidateQueries({ queryKey: ['staff-active-orders'] });
    toast.success(`${selectedOrders.length} orders deleted`);
    setSelectedIds(new Set());
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('StaffDashboard')}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white">Active Orders</h1>
              <Badge className="bg-orange-500">{activeOrders.length}</Badge>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <>
                  <span className="text-slate-400 text-sm">{selectedIds.size} selected</span>
                  <Button onClick={handleCreateInstruction} className="bg-teal-600 hover:bg-teal-700">
                    <FileDown className="w-4 h-4 mr-2" />
                    Create Instruction
                  </Button>
                  <Button onClick={handleMarkAsExecuted} className="bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Executed
                  </Button>
                  <Button onClick={handleDeleteSelected} variant="destructive">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="pending_payment">Pending Payment</SelectItem>
              <SelectItem value="on_execution">On Execution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.size === filteredOrders.filter(o => !o.non_mandiri_execution).length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-slate-300">Order ID</TableHead>
                <TableHead className="text-slate-300">Client</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Beneficiary</TableHead>
                <TableHead className="text-slate-300">Bank/BIC</TableHead>
                <TableHead className="text-slate-300">Invoice</TableHead>
                <TableHead className="text-slate-300">Payment</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Last Export</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={11} className="text-center text-slate-400 py-8">Loading...</TableCell></TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center text-slate-400 py-8">No active orders</TableCell></TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-slate-700 hover:bg-slate-750">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={(checked) => handleSelectOne(order.id, checked)}
                      disabled={order.non_mandiri_execution}
                    />
                  </TableCell>
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
                    <Badge className={order.invoice_received ? 'bg-green-600' : 'bg-slate-600'}>
                      {order.invoice_received ? 'Y' : 'N'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={order.payment_proof ? 'bg-green-600' : 'bg-slate-600'}>
                      {order.payment_proof ? 'Y' : 'N'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {order.last_download ? new Date(order.last_download).toLocaleDateString() : '-'}
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
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order, 'check')} className="text-white hover:bg-slate-700">
                          Set: Check
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order, 'on_execution')} className="text-white hover:bg-slate-700">
                          Set: On Execution
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order, 'rejected')} className="text-red-400 hover:bg-slate-700">
                          Set: Rejected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order, 'released')} className="text-green-400 hover:bg-slate-700">
                          Set: Released
                        </DropdownMenuItem>
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
    </div>
  );
}