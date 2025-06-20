"use client";
import Card from "../components/Card";
import { useForm } from "react-hook-form";
import ProtectedRoute from "../components/ProtectedRoute";

const initialProfile = {
  name: "Alice Johnson",
  email: "alice@company.com",
  department: "Frontend",
  skills: "React,TypeScript",
  seniority: "senior",
};

export default function ProfilePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialProfile,
  });

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
              <input
                className="w-full border rounded px-3 py-2"
                {...register("name", { required: true })}
              />
              {errors.name && <span className="text-xs text-red-500">Name is required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full border rounded px-3 py-2 bg-gray-100"
                {...register("email")}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("department")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("skills")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seniority</label>
              <select className="w-full border rounded px-3 py-2" {...register("seniority")}>\n              <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
} 