import { Badge } from "@/components/ui/badge";

interface SkillTagProps {
  skill: string;
}

export default function SkillTag({ skill }: SkillTagProps) {
  return (
    <Badge variant="outline" className="text-xs px-2 py-0.5 mr-1">
      {skill}
    </Badge>
  );
} 