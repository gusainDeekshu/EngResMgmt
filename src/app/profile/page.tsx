"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { toast } from "sonner";
import { User, Save, X } from "lucide-react";
import { Quicksand } from 'next/font/google';
import { put, get } from "@/lib/api";
import { useAuth } from "../components/AuthProvider";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: '600',
});

const SKILL_OPTIONS = [
  "React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "Python", "Java", "C++", "DevOps", "UI/UX"
];

export default function ProfilePage() {
  const { user: authUser, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      department: "",
      skills: [] as string[],
      seniority: "mid",
    },
  });
  
  const skills = watch("skills") || [];

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await get("/api/auth/profile");
        const userData = response.user;
        
        // Update form with fetched data
        reset({
          name: userData.name || "",
          email: userData.email || "",
          department: userData.department || "",
          skills: userData.skills || [],
          seniority: userData.seniority || "mid",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data", {
          description: "Please refresh the page to try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser, reset]);

  function addSkill(skill: string) {
    if (skill && !skills.includes(skill)) {
      setValue("skills", [...skills, skill]);
    }
    setSkillInput("");
  }
  
  function removeSkill(skill: string) {
    setValue("skills", skills.filter((s: string) => s !== skill));
  }

  const onSubmit = async (data: any) => {
    try {
      const response = await put("/api/auth/profile", {
        name: data.name,
        department: data.department,
        skills: data.skills,
        seniority: data.seniority,
      });
      
      // Update the auth context with new user data
      if (authUser && response.user) {
        login(response.user, localStorage.getItem("token") || "");
      }
      
      toast.success("Profile updated successfully!", {
        description: "Your profile information has been saved.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later.",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading profile...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${quicksand.className} mb-2`}>
            My Profile
          </h1>
          <p className="text-gray-600">
            Update your personal information and skills
          </p>
        </div>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gradient-to-r  border-b border-gray-100">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <span className={quicksand.className}>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input 
                    {...register("name", { required: true })} 
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1">Name is required</span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input 
                    className="bg-gray-50 border-gray-300 text-gray-600" 
                    {...register("email")} 
                    disabled 
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <Input 
                    {...register("department")} 
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Frontend, Backend, DevOps"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seniority Level
                  </label>
                  <Select
                    onValueChange={val => setValue("seniority", val)}
                    defaultValue={watch("seniority")}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select seniority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid-Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("seniority")} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills & Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill: string) => (
                    <span 
                      key={skill} 
                      className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full flex items-center gap-2 border border-indigo-200"
                    >
                      {skill}
                      <button 
                        type="button" 
                        className="text-indigo-500 hover:text-indigo-700 transition-colors" 
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Type a skill and press Enter, or select from suggestions"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSkill(skillInput.trim());
                    }
                  }}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  list="skill-options"
                />
                <datalist id="skill-options">
                  {SKILL_OPTIONS.filter(opt => !skills.includes(opt)).map(opt => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter or comma to add a skill
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
} 