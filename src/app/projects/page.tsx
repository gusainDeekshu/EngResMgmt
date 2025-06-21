"use client";
import { useState, useEffect } from "react";
import ProjectTable from "../components/ProjectTable";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { get, post, put, del } from "@/lib/api";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../components/AuthProvider";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ index: number; name: string } | null>(null);
  const { user } = useAuth();

  async function fetchProjects() {
    setLoading(true);
    const res = await get("/api/projects");
    setProjects(
      res.projects.map((p: any) => ({
        name: p.name,
        description: p.description,
        start: p.startDate?.slice(0, 10),
        end: p.endDate?.slice(0, 10),
        status: p.status,
        requiredSkills: p.requiredSkills,
        teamSize: p.teamSize,
      }))
    );
    setProjectIds(res.projects.map((p: any) => p._id));
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async (data: any) => {
    if (!user?.id) {
      toast.error("You must be logged in to create a project");
      return;
    }
    
    setOpen(false);
    setEditIndex(null);
    const payload = {
      name: data.name,
      description: data.description,
      startDate: data.start,
      endDate: data.end,
      requiredSkills: data.requiredSkills.split(",").map((s: string) => s.trim()),
      teamSize: Number(data.teamSize),
      status: data.status,
      managerId: user.id,
    };
    try {
      await post("/api/projects", payload);
      toast.success(`Project "${data.name}" created successfully`);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (editIndex === null) return;
    if (!user?.id) {
      toast.error("You must be logged in to edit a project");
      return;
    }
    
    setOpen(false);
    const id = projectIds[editIndex];
    const payload = {
      name: data.name,
      description: data.description,
      startDate: data.start,
      endDate: data.end,
      requiredSkills: data.requiredSkills.split(",").map((s: string) => s.trim()),
      teamSize: Number(data.teamSize),
      status: data.status,
      managerId: user.id,
    };
    try {
      await put(`/api/projects/${id}`, payload);
      toast.success(`Project "${data.name}" updated successfully`);
      setEditIndex(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  const handleDelete = async (index: number) => {
    const projectName = projects[index]?.name || "this project";
    setProjectToDelete({ index, name: projectName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    const { index, name } = projectToDelete;
    const id = projectIds[index];
    
    try {
      const result = await del(`/api/projects/${id}`);
      const deletedAssignments = result?.deletedAssignments || 0;
      
      if (deletedAssignments > 0) {
        toast.success(
          `Project "${name}" deleted successfully. ${deletedAssignments} related assignment${deletedAssignments === 1 ? '' : 's'} also deleted.`
        );
      } else {
        toast.success(`Project "${name}" deleted successfully`);
      }
      
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    }
  };

  const initialEdit =
    editIndex !== null && projects[editIndex]
      ? {
          ...projects[editIndex],
          requiredSkills: projects[editIndex].requiredSkills.join(", "),
        }
      : undefined;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto mt-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" onClick={() => { setOpen(true); setEditIndex(null); }}>
            Add Project
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ProjectTable projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <Modal open={open} onClose={() => { setOpen(false); setEditIndex(null); }} title={editIndex !== null ? "Edit Project" : "Add Project"}>
          <ProjectForm onSubmit={editIndex !== null ? handleEditSubmit : handleAdd} initial={initialEdit} />
        </Modal>
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Project"
          description={`Are you sure you want to delete "${projectToDelete?.name}"?\n\nThis action will also delete all assignments related to this project and cannot be undone.`}
          confirmText="Delete Project"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </div>
    </ProtectedRoute>
  );
} 