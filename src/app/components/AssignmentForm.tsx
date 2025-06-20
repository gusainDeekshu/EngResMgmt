"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    setValue,
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
        <Select
          onValueChange={val => setValue("projectId", val)}
          defaultValue={initial?.projectId || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Select project</SelectItem>
            {projects.map((p: any) => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("projectId", { required: true })} />
        {errors.projectId && <span className="text-xs text-red-500">Project is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Engineer</label>
        <Select
          onValueChange={val => setValue("engineerId", val)}
          defaultValue={initial?.engineerId || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select engineer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Select engineer</SelectItem>
            {engineers.map((e: any) => (
              <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("engineerId", { required: true })} />
        {errors.engineerId && <span className="text-xs text-red-500">Engineer is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Allocation %</label>
        <Input type="number" min={0} max={100} {...register("allocation", { required: true, min: 0, max: 100 })} />
        {errors.allocation && <span className="text-xs text-red-500">0-100 required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <Input {...register("role", { required: true })} />
        {errors.role && <span className="text-xs text-red-500">Role is required</span>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input type="date" {...register("start", { required: true })} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input type="date" {...register("end", { required: true })} />
        </div>
      </div>
      <Button type="submit" className="mt-4" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Assignment"}
      </Button>
    </form>
  );
} 