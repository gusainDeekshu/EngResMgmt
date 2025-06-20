"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const SKILL_OPTIONS = [
  "React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "Python", "Java", "C++", "DevOps", "UI/UX"
];

const initialProfile = {
  name: "Alice Johnson",
  email: "alice@company.com",
  department: "Frontend",
  skills: ["React", "TypeScript"],
  seniority: "senior",
};

export default function ProfilePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: initialProfile,
  });
  const [skillInput, setSkillInput] = useState("");
  const skills = watch("skills") || [];

  function addSkill(skill: string) {
    if (skill && !skills.includes(skill)) {
      setValue("skills", [...skills, skill]);
    }
    setSkillInput("");
  }
  function removeSkill(skill: string) {
    setValue("skills", skills.filter((s: string) => s !== skill));
  }

  const onSubmit = (data: any) => {
    // TODO: Call API to update profile
    alert("Profile saved!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto mt-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">My Profile</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input {...register("name", { required: true })} />
              {errors.name && <span className="text-xs text-red-500">Name is required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input className="bg-gray-100" {...register("email") } disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <Input {...register("department")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {skills.map((skill: string) => (
                  <span key={skill} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    {skill}
                    <button type="button" className="ml-1 text-xs text-red-500" onClick={() => removeSkill(skill)}>&times;</button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="Type and press Enter or select from list"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addSkill(skillInput.trim());
                  }
                }}
                list="skill-options"
              />
              <datalist id="skill-options">
                {SKILL_OPTIONS.filter(opt => !skills.includes(opt)).map(opt => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seniority</label>
              <Select
                onValueChange={val => setValue("seniority", val)}
                defaultValue={initialProfile.seniority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("seniority")} />
            </div>
            <Button
              type="submit"
              className="mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
} 