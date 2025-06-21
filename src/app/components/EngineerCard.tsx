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
  seniority: string;
}

export default function EngineerCard({ engineer }: { engineer: Engineer }) {
  return (
    <Card className="flex flex-row p-4 gap-4 items-center border-[2px] border-gray-800 rounded-lg shadow-md shadow-gray-900">
      <div className="flex flex-col items-center min-w-[100px]">
        <Avatar className="w-20 h-20 mb-2">
          {engineer.img ? (
            <AvatarImage src={engineer.img} alt={engineer.name} />
          ) : (
            <AvatarFallback>{engineer.name[0]}</AvatarFallback>
          )}
        </Avatar>
        <div className="text-sm font-semibold text-center">{engineer.name}</div>
        <div className="text-xs text-gray-500 text-center">{engineer.seniority} {engineer.role}</div>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {engineer.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs px-2 py-0.5">
              {skill}
            </Badge>
          ))}
        </div>
        <Progress value={engineer.percent} className="h-2 mb-1" />
        <div className="text-xs text-gray-500">{engineer.percent}% allocated</div>
      </div>
    </Card>
  );
}
