import { create } from "zustand";

export const useResumeStore = create((set) => ({
  template: "modern",
  isPreviewVisible: false,

  data: {
    personal: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      portfolio: "",
      photo: "",
    },
    summary: "",
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
  },

  setSection: (section, payload) =>
    set((state) => ({
      data: {
        ...state.data,
        [section]: Array.isArray(payload)
          ? [...payload]
          : typeof payload === "object"
          ? { ...payload }
          : payload,
      },
    })),

  setTemplate: (t) => set({ template: t }),
  togglePreview: (value) => set({ isPreviewVisible: value }),
}));
