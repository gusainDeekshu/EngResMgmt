import StatCard from "./StatCard";

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
}

export default function StatCardsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
} 