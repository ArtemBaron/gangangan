import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User, Mail, Phone, Globe } from 'lucide-react';

export default function SenderSection({ formData, onChange }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Building2 className="w-5 h-5 text-blue-900" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sender_business_name" className="text-slate-700 font-medium">
            Business Name *
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="sender_business_name"
              value={formData.sender_business_name || ''}
              onChange={(e) => onChange({ sender_business_name: e.target.value })}
              placeholder="Enter business name"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender_contact_person" className="text-slate-700 font-medium">
            Contact Person
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="sender_contact_person"
              value={formData.sender_contact_person || ''}
              onChange={(e) => onChange({ sender_contact_person: e.target.value })}
              placeholder="Contact person name"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="sender_email" className="text-slate-700 font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="sender_email"
                type="email"
                value={formData.sender_email || ''}
                onChange={(e) => onChange({ sender_email: e.target.value })}
                placeholder="business@company.com"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_phone" className="text-slate-700 font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="sender_phone"
                type="tel"
                value={formData.sender_phone || ''}
                onChange={(e) => onChange({ sender_phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender_country" className="text-slate-700 font-medium">
            Country
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="sender_country"
              value={formData.sender_country || ''}
              onChange={(e) => onChange({ sender_country: e.target.value })}
              placeholder="Country"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}