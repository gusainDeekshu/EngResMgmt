"use client";
import { useForm } from "react-hook-form";
import Card from "./Card";
import { useEffect } from "react";

export default function AssignmentForm({
  onSubmit,
  initial,
  projects,
  engineers,
}: {
  onSubmit: (data: any) => void;
  initial?: any;
  projects: any[];
  engineers: any[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: initial || {
      projectId: "",
      engineerId: "",
      allocation: 50,
      role: "",
      start: "",
      end: "",
    },
  });

  // To re-initialize the form when the `initial` prop changes.
  // This is important for when the user switches between adding and editing.
  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium mb-1">Project</label>
        <select className="w-full border rounded px-3 py-2" {...register("projectId", { required: true })}>
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        {errors.projectId && <span className="text-xs text-red-500">Project is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Engineer</label>
        <select className="w-full border rounded px-3 py-2" {...register("engineerId", { required: true })}>
          <option value="">Select engineer</option>
          {engineers.map((e) => (
            <option key={e._id} value={e._id}>{e.name}</option>
          ))}
        </select>
        {errors.engineerId && <span className="text-xs text-red-500">Engineer is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Allocation %</label>
        <input type="number" min={0} max={100} className="w-full border rounded px-3 py-2" {...register("allocation", { required: true, min: 0, max: 100 })} />
        {errors.allocation && <span className="text-xs text-red-500">0-100 required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <input className="w-full border rounded px-3 py-2" {...register("role", { required: true })} />
        {errors.role && <span className="text-xs text-red-500">Role is required</span>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" {...register("start", { required: true })} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" {...register("end", { required: true })} />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Assignment"}
      </button>
    </form>
  );
} 