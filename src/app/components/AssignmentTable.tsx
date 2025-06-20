import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Assignment {
  project: string;
  engineer: string;
  allocation: number;
  role: string;
  start: string;
  end: string;
}

interface AssignmentTableProps {
  assignments: Assignment[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export default function AssignmentTable({ assignments, onEdit, onDelete }: AssignmentTableProps) {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-indigo-50">
            <th className="px-4 py-2 text-left font-semibold">Project</th>
            <th className="px-4 py-2 text-left font-semibold">Engineer</th>
            <th className="px-4 py-2 text-left font-semibold">Allocation</th>
            <th className="px-4 py-2 text-left font-semibold">Role</th>
            <th className="px-4 py-2 text-left font-semibold">Start</th>
            <th className="px-4 py-2 text-left font-semibold">End</th>
            {(onEdit || onDelete) && <th className="px-4 py-2"></th>}
          </tr>
        </thead>
        <tbody>
          {assignments.map((a, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{a.project}</td>
              <td className="px-4 py-2">{a.engineer}</td>
              <td className="px-4 py-2">{a.allocation}%</td>
              <td className="px-4 py-2">{a.role}</td>
              <td className="px-4 py-2">{a.start}</td>
              <td className="px-4 py-2">{a.end}</td>
              {(onEdit || onDelete) && (
                <td className="px-4 py-2 flex gap-2">
                  {onEdit && (
                    <Button variant="ghost" className="text-indigo-600 px-2 py-1 h-auto" onClick={() => onEdit(i)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" className="text-red-600 px-2 py-1 h-auto" onClick={() => onDelete(i)}>
                      Delete
                    </Button>
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