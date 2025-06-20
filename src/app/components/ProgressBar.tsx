import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  percent: number;
  color?: string;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  return <Progress value={percent} className="h-2" />;
} 