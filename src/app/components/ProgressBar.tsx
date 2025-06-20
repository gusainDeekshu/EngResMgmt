interface ProgressBarProps {
  percent: number;
  color?: string;
}

export default function ProgressBar({ percent, color = "bg-indigo-500" }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
} 