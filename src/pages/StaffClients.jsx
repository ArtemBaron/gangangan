import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, UserX, UserCheck, Search } from 'lucide-react';

export default function StaffClients() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    description: '',
    email: '',
    active: true
  });

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingClient) {
        return base44.entities.Client.update(editingClient.id, data);
      }
      return base44.entities.Client.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(editingClient ? 'Client updated' : 'Client created');
      closeDialog();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (client) => base44.entities.Client.update(client.id, { active: !client.active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client status updated');
    },
  });

  const openCreateDialog = () => {
    setEditingClient(null);
    setFormData({ client_id: '', name: '', description: '', email: '', active: true });
    setDialogOpen(true);
  };

  const openEditDialog = (client) => {
    setEditingClient(client);
    setFormData({
      client_id: client.client_id,
      name: client.name,
      description: client.description || '',
      email: client.email,
      active: client.active
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = () => {
    if (!formData.client_id || !formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }
    saveMutation.mutate(formData);
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_id?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
      <header className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 border-b border-teal-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <h1 className="text-xl font-bold text-white">Client Management</h1>
            </div>
            <Button onClick={openCreateDialog} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="text-slate-300">Client ID</TableHead>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Description</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">No clients found</TableCell>
                </TableRow>
              ) : filteredClients.map((client) => (
                <TableRow key={client.id} className="border-slate-700 hover:bg-slate-750">
                  <TableCell className="text-white font-mono">{client.client_id}</TableCell>
                  <TableCell className="text-white font-medium">{client.name}</TableCell>
                  <TableCell className="text-slate-300">{client.email}</TableCell>
                  <TableCell className="text-slate-400 max-w-[200px] truncate">{client.description}</TableCell>
                  <TableCell>
                    <Badge className={client.active ? 'bg-green-600 text-white' : 'bg-slate-600 text-white'}>
                      {client.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(client)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActiveMutation.mutate(client)}
                        className={client.active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
                      >
                        {client.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Client ID *</Label>
              <Input
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                placeholder="e.g., CLT-001"
                className="bg-slate-900 border-slate-600"
                disabled={!!editingClient}
              />
            </div>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Client name"
                className="bg-slate-900 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@example.com"
                className="bg-slate-900 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                className="bg-slate-900 border-slate-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending} className="bg-teal-600 hover:bg-teal-700">
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}