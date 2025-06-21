import { create } from "zustand";

interface DashboardState {
  engineerSkillFilter: string;
  setEngineerSkillFilter: (val: string) => void;
  projectStatusFilter: string;
  setProjectStatusFilter: (val: string) => void;
  timelineStartDate: Date;
  setTimelineStartDate: (date: Date) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  engineerSkillFilter: "",
  setEngineerSkillFilter: (val) => set({ engineerSkillFilter: val }),
  projectStatusFilter: "",
  setProjectStatusFilter: (val) => set({ projectStatusFilter: val }),
  timelineStartDate: new Date(),
  setTimelineStartDate: (date) => set({ timelineStartDate: date }),
})); 