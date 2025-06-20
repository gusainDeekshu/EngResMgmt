import Card from "./Card";
import ProgressBar from "./ProgressBar";
import SkillTag from "./SkillTag";
import Image from "next/image";

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
      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
        {engineer.img ? (
          <Image src={engineer.img} alt={engineer.name} width={56} height={56} />
        ) : (
          <span className="text-2xl text-indigo-700">👤</span>
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{engineer.name}</div>
        <div className="text-xs text-gray-500 mb-1">{engineer.role}</div>
        <div className="flex gap-1 mb-1 flex-wrap">
          {engineer.skills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
        </div>
        <ProgressBar percent={engineer.percent} />
        <div className="text-xs text-gray-400 mt-1">{engineer.percent}% allocated</div>
      </div>
    </Card>
  );
} 