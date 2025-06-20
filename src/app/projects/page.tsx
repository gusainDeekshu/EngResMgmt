"use client";
import { useState, useEffect } from "react";
import ProjectTable from "../components/ProjectTable";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import { get, post, put, del } from "@/lib/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
      managerId: "manager-id-placeholder", // TODO: Replace with real manager id
    };
    await post("/api/projects", payload);
    fetchProjects();
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (editIndex === null) return;
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
      managerId: "manager-id-placeholder", // TODO: Replace with real manager id
    };
    await put(`/api/projects/${id}`, payload);
    setEditIndex(null);
    fetchProjects();
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this project?")) return;
    const id = projectIds[index];
    await del(`/api/projects/${id}`);
    fetchProjects();
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
      </div>
    </ProtectedRoute>
  );
} 