import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, CreditCard, Building, Globe, Phone } from 'lucide-react';

export default function BeneficiarySection({ formData, onChange }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <UserCheck className="w-5 h-5 text-blue-900" />
          Beneficiary Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="beneficiary_name" className="text-slate-700 font-medium">
            Recipient Name *
          </Label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="beneficiary_name"
              value={formData.beneficiary_name || ''}
              onChange={(e) => onChange({ beneficiary_name: e.target.value })}
              placeholder="Full name of recipient"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="beneficiary_account" className="text-slate-700 font-medium">
            Account Number / Mobile Money
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="beneficiary_account"
              value={formData.beneficiary_account || ''}
              onChange={(e) => onChange({ beneficiary_account: e.target.value })}
              placeholder="Bank account or mobile money number"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="beneficiary_bank" className="text-slate-700 font-medium">
            Bank / Provider Name
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="beneficiary_bank"
              value={formData.beneficiary_bank || ''}
              onChange={(e) => onChange({ beneficiary_bank: e.target.value })}
              placeholder="Bank name or mobile money provider"
              className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="beneficiary_country" className="text-slate-700 font-medium">
              Country
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="beneficiary_country"
                value={formData.beneficiary_country || ''}
                onChange={(e) => onChange({ beneficiary_country: e.target.value })}
                placeholder="Recipient country"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary_phone" className="text-slate-700 font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="beneficiary_phone"
                type="tel"
                value={formData.beneficiary_phone || ''}
                onChange={(e) => onChange({ beneficiary_phone: e.target.value })}
                placeholder="+234 xxx xxx xxxx"
                className="pl-10 border-slate-200 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}