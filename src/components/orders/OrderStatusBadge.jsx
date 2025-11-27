import React from 'react';
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  created: { label: 'Created', color: 'bg-blue-100 text-blue-800' },
  check: { label: 'Check', color: 'bg-yellow-100 text-yellow-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  pending_payment: { label: 'Pending Payment', color: 'bg-orange-100 text-orange-800' },
  on_execution: { label: 'On Execution', color: 'bg-purple-100 text-purple-800' },
  released: { label: 'Released', color: 'bg-green-100 text-green-800' }
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-800' };
  
  return (
    <Badge className={`${config.color} font-medium`}>
      {config.label}
    </Badge>
  );
}

export { STATUS_CONFIG };