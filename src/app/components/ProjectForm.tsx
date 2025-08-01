"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Input {...register("name", { required: true })} />
        {errors.name && <span className="text-xs text-red-500">Name is required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-none"
          {...register("description",{ required: true })}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input type="date"  {...register("start", { required: true })} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input type="date" {...register("end", { required: true })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Required Skills (comma separated)</label>
        <Input {...register("requiredSkills",{ required: true })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Team Size</label>
        <Input type="number" min={1} {...register("teamSize", { required: true, min: 1 })} />
        {errors.teamSize && <span className="text-xs text-red-500">Team size required</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select {...register("status",{ required: true })}
          defaultValue={initial?.status || "planning"}
          onValueChange={val => {
            // react-hook-form workaround for controlled Select
            (document.querySelector('[name="status"]') as HTMLInputElement).value = val;
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" {...register("status",{ required: true })} />
      </div>
      <Button type="submit" className="mt-4" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Project"}
      </Button>
    </form>
  );
} 