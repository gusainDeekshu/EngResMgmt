import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Engineer {
  name: string;
  role: string;
  skills: string[];
  percent: number;
  img?: string;
}

export default function EngineerCard({ engineer }: { engineer: Engineer }) {
  return (
    <Card className="flex items-center gap-4">
      <Avatar className="w-14 h-14">
        {engineer.img ? (
          <AvatarImage src={engineer.img} alt={engineer.name} />
        ) : (
          <AvatarFallback>{engineer.name[0]}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{engineer.name}</div>
        <div className="text-xs text-gray-500 mb-1">{engineer.role}</div>
        <div className="flex gap-1 mb-1 flex-wrap">
          {engineer.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs px-2 py-0.5 mr-1">{skill}</Badge>
          ))}
        </div>
        <Progress value={engineer.percent} className="h-2" />
        <div className="text-xs text-gray-400 mt-1">{engineer.percent}% allocated</div>
      </div>
    </Card>
  );
} 