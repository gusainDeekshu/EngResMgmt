"use client";
import { useForm } from "react-hook-form";
import Card from "./Card";

export default function ProjectForm({ onSubmit, initial }: { onSubmit: (data: any) => void; initial?: any }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initial || {
      name: "",
      description: "",
      start: "",
      end: "",
      requiredSkills: "",
      teamSize: 1,
      status: "planning",
    },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="w-full border rounded px-3 py-2" {...register("name", { required: true })} />
        {errors.name && <span className="text-xs text-red-500">Name is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="w-full border rounded px-3 py-2" {...register("description")}></textarea>
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
      <div>
        <label className="block text-sm font-medium mb-1">Required Skills (comma separated)</label>
        <input className="w-full border rounded px-3 py-2" {...register("requiredSkills")}/>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Team Size</label>
        <input type="number" min={1} className="w-full border rounded px-3 py-2" {...register("teamSize", { required: true, min: 1 })} />
        {errors.teamSize && <span className="text-xs text-red-500">Team size required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select className="w-full border rounded px-3 py-2" {...register("status")}>\n          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Project"}
      </button>
    </form>
  );
} 