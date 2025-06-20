import Card from "./Card";

interface Project {
  name: string;
  description: string;
  start: string;
  end: string;
  status: string;
  requiredSkills: string[];
  teamSize: number;
}

interface ProjectTableProps {
  projects: Project[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export default function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-indigo-50">
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Description</th>
            <th className="px-4 py-2 text-left font-semibold">Start</th>
            <th className="px-4 py-2 text-left font-semibold">End</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            <th className="px-4 py-2 text-left font-semibold">Required Skills</th>
            <th className="px-4 py-2 text-left font-semibold">Team Size</th>
            {(onEdit || onDelete) && <th className="px-4 py-2"></th>}
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 font-semibold">{p.name}</td>
              <td className="px-4 py-2">{p.description}</td>
              <td className="px-4 py-2">{p.start}</td>
              <td className="px-4 py-2">{p.end}</td>
              <td className="px-4 py-2">{p.status}</td>
              <td className="px-4 py-2">
                {p.requiredSkills.map((s) => (
                  <span key={s} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full mr-1">{s}</span>
                ))}
              </td>
              <td className="px-4 py-2">{p.teamSize}</td>
              {(onEdit || onDelete) && (
                <td className="px-4 py-2 flex gap-2">
                  {onEdit && (
                    <button className="text-indigo-600 hover:underline" onClick={() => onEdit(i)}>
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button className="text-red-600 hover:underline" onClick={() => onDelete(i)}>
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
} 