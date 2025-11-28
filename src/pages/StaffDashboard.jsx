import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Settings, Database } from 'lucide-react';

const modules = [
  {
    title: 'Clients',
    description: 'Manage client accounts',
    icon: Users,
    page: 'StaffClients',
    color: 'bg-teal-600'
  },
  {
    title: 'Active Orders',
    description: 'View and process active orders',
    icon: FileText,
    page: 'StaffActiveOrders',
    color: 'bg-orange-500'
  },
  {
    title: 'Executed Orders',
    description: 'View completed orders',
    icon: CheckCircle,
    page: 'StaffExecutedOrders',
    color: 'bg-emerald-600'
  },
  {
    title: 'Payeer Accounts',
    description: 'Manage payer accounts by currency',
    icon: Database,
    page: 'StaffPayeerAccounts',
    color: 'bg-cyan-700'
  }
];

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
      <header className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 border-b border-teal-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69233f5a9a123941f81322f5/b1a1be267_gan.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Staff Administration</h1>
              <p className="text-teal-300">Manage orders, clients, and operations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link key={module.page} to={createPageUrl(module.page)}>
              <Card className="bg-slate-800/80 border-slate-700 hover:border-teal-600 hover:shadow-lg hover:shadow-teal-900/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-3`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{module.title}</CardTitle>
                  <CardDescription className="text-slate-400">{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}