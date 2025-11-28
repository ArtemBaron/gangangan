import React from 'react';
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  created: { label: 'Created', color: 'bg-blue-500 text-white border-blue-600' },
  check: { label: 'Check', color: 'bg-yellow-500 text-white border-yellow-600' },
  rejected: { label: 'Rejected', color: 'bg-red-600 text-white border-red-700' },
  pending_payment: { label: 'Pending Payment', color: 'bg-orange-500 text-white border-orange-600' },
  on_execution: { label: 'On Execution', color: 'bg-purple-600 text-white border-purple-700' },
  released: { label: 'Released', color: 'bg-green-600 text-white border-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-500 text-white border-slate-600' }
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-800' };
  
  return (
    <Badge className={`${config.color} font-semibold px-3 py-1 shadow-sm border`}>
      {config.label}
    </Badge>
  );
}

export { STATUS_CONFIG };