import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  className?: string;
}

export default function StatCard({ label, value, icon, change, className = "" }: StatCardProps) {
  return (
    <Card className={`flex flex-col items-center justify-center text-center gap-2 bg-sky-50 rounded-lg p-4  border-[2px] border-gray-800 rounded-lg  ${className}`}>
  {icon && <div className="text-4xl">{icon}</div>}

  <div className="flex flex-col items-center">
    <div className="text-l  font-medium">{label}</div>
    <div className="text-2xl font-bold text-indigo-900">{value}</div>
    {change && <div className="text-xs mt-1 text-green-600 font-semibold">{change}</div>}
  </div>
</Card>

  );
} 