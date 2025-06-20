"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AssignmentTable from "../components/AssignmentTable";
import Modal from "../components/Modal";
import AssignmentForm from "../components/AssignmentForm";
import { get, post, put, del } from "@/lib/api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AssignmentsPage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [rawAssignments, setRawAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchInitialData() {
    setLoading(true);
    const [assignmentsRes, projectsRes, engineersRes] = await Promise.all([
      get("/api/assignments"),
      get("/api/projects"),
      get("/api/engineers"),
    ]);
    
    setRawAssignments(assignmentsRes.assignments);
    setAssignments(
      assignmentsRes.assignments.map((a: any) => ({
        project: a.projectId?.name || a.projectId || "",
        engineer: a.engineerId?.name || a.engineerId || "",
        allocation: a.allocationPercentage,
        role: a.role,
        start: a.startDate?.slice(0, 10),
        end: a.endDate?.slice(0, 10),
      }))
    );
    setAssignmentIds(assignmentsRes.assignments.map((a: any) => a._id));
    setProjects(projectsRes.projects);
    setEngineers(engineersRes.engineers);
    setLoading(false);
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAdd = async (data: any) => {
    setOpen(false);
    setEditIndex(null);
    const payload = {
      projectId: data.projectId,
      engineerId: data.engineerId,
      allocationPercentage: Number(data.allocation),
      role: data.role,
      startDate: data.start,
      endDate: data.end,
    };
    try {
      await post("/api/assignments", payload);
      toast.success("Assignment added successfully");
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add assignment");
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (editIndex === null) return;
    setOpen(false);
    const id = assignmentIds[editIndex];
    const payload = {
      projectId: data.projectId,
      engineerId: data.engineerId,
      allocationPercentage: Number(data.allocation),
      role: data.role,
      startDate: data.start,
      endDate: data.end,
    };
    try {
      await put(`/api/assignments/${id}`, payload);
      toast.success("Assignment updated successfully");
      setEditIndex(null);
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update assignment");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this assignment?")) return;
    const id = assignmentIds[index];
    try {
      await del(`/api/assignments/${id}`);
      toast.success("Assignment deleted successfully");
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete assignment");
    }
  };

  const initialEdit =
    editIndex !== null && rawAssignments[editIndex]
      ? {
          projectId: rawAssignments[editIndex].projectId?._id || rawAssignments[editIndex].projectId,
          engineerId: rawAssignments[editIndex].engineerId?._id || rawAssignments[editIndex].engineerId,
          allocation: rawAssignments[editIndex].allocationPercentage,
          role: rawAssignments[editIndex].role,
          start: rawAssignments[editIndex].startDate?.slice(0, 10),
          end: rawAssignments[editIndex].endDate?.slice(0, 10),
        }
      : undefined;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto mt-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Assignments</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" onClick={() => { setOpen(true); setEditIndex(null); }}>
            Add Assignment
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <AssignmentTable assignments={assignments} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <Modal open={open} onClose={() => { setOpen(false); setEditIndex(null); }} title={editIndex !== null ? "Edit Assignment" : "Add Assignment"}>
          <AssignmentForm 
            onSubmit={editIndex !== null ? handleEditSubmit : handleAdd} 
            initial={initialEdit}
            projects={projects}
            engineers={engineers}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
} 