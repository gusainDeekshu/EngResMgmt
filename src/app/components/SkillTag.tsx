interface SkillTagProps {
  skill: string;
}

export default function SkillTag({ skill }: SkillTagProps) {
  return (
    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium mr-1">
      {skill}
    </span>
  );
} 