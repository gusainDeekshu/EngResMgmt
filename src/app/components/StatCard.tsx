import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  className?: string;
}

export default function StatCard({ label, value, icon, change, className = "" }: StatCardProps) {
  return (
    <div className={`flex items-center gap-4 bg-indigo-50 rounded-lg p-4 shadow-sm border border-indigo-100 ${className}`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="flex-1">
        <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
        <div className="text-2xl font-bold text-indigo-900">{value}</div>
        {change && <div className="text-xs mt-1 text-green-600 font-semibold">{change}</div>}
      </div>
    </div>
  );
} 