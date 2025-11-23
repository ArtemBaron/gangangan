import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Calendar } from 'lucide-react';

export default function CustomerSection({ formData, onChange }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Building2 className="w-5 h-5 text-blue-900" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="text-slate-700 font-medium">
              Customer Name (Principal) *
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="customer_name"
                value={formData.customer_name || ''}
                onChange={(e) => onChange({ customer_name: e.target.value })}
                placeholder="Company name of customer"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_date" className="text-slate-700 font-medium">
              Order Date *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="order_date"
                type="date"
                value={formData.order_date || new Date().toISOString().split('T')[0]}
                onChange={(e) => onChange({ order_date: e.target.value })}
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}