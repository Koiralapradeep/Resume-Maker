import { useForm, useFieldArray } from "react-hook-form";
import { useResumeStore } from "../store/useResumeStore";
import axios from "axios";
import { useState } from "react";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Heart,
  Upload,
  X
} from "lucide-react";

export default function ResumeForm() {
  const { data, setSection } = useResumeStore();
  const { register, handleSubmit, control, reset, setValue, getValues, watch } = useForm({
    defaultValues: data,
  });

  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(data.personal?.photo || null);

  const edu = useFieldArray({ control, name: "education" });
  const exp = useFieldArray({ control, name: "experience" });

  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${BACKEND}${url}`);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Removed all restrictions (no size/type checks)
    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);
      const res = await axios.post(`${BACKEND}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = toAbsolute(res.data.url);
      setPhotoPreview(url);
      setValue("personal.photo", url, { shouldDirty: true, shouldTouch: true });
      const current = getValues().personal || data.personal;
      setSection("personal", { ...current, photo: url });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setValue("personal.photo", "", { shouldDirty: true });
    const current = getValues().personal || data.personal;
    setSection("personal", { ...current, photo: "" });
  };

  const onSubmit = (values) => {
    if (!values.personal?.name || !values.personal?.email || !values.personal?.phone) {
      alert("Please fill in Name, Email, and Phone (required fields)");
      return;
    }

    const safeSplit = (str) =>
      typeof str === "string" ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

    setSection("personal", values.personal || {});
    setSection("summary", values.summary || "");
    setSection("education", values.education || []);
    setSection("experience", values.experience || []);
    setSection("skills", safeSplit(values.skills));
    setSection("languages", safeSplit(values.languages));
    setSection("interests", safeSplit(values.interests));

    alert("Resume updated successfully! Check the preview.");
  };

  const summaryText = watch("summary") || "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-8 font-['Inter'] bg-white"
    >
      {/* PERSONAL INFORMATION */}
      <Section 
        title="Personal Information" 
        icon={<User className="w-5 h-5" />}
        subtitle="Basic contact details and professional identity"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 bg-slate-50 shadow-sm">
              {photoPreview ? (
                <>
                  <img 
                    src={photoPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Upload className="w-8 h-8 mb-1" />
                  <span className="text-xs">No Photo</span>
                </div>
              )}
            </div>
            <label className="px-4 py-2 bg-slate-700 text-white text-sm rounded-md cursor-pointer hover:bg-slate-800 transition flex items-center gap-2 shadow-sm">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input 
                type="file" 
                onChange={handlePhotoUpload} 
                disabled={uploading}
                className="hidden" 
              />
            </label>
            <p className="text-xs text-slate-500 text-center">Professional photo (any size)</p>
          </div>

          {/* Personal Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Input 
              label="Full Name" 
              required 
              placeholder="John Doe"
              {...register("personal.name", { required: true })} 
            />
            <Input 
              label="Professional Title" 
              required
              placeholder="e.g., Software Engineer, Teacher, Doctor"
              {...register("personal.title", { required: true })} 
            />
            <Input 
              label="Email Address" 
              required 
              type="email"
              placeholder="john.doe@email.com"
              {...register("personal.email", { required: true })} 
            />
            <Input 
              label="Phone Number" 
              required 
              placeholder="+977 9821122997"
              {...register("personal.phone", { required: true })} 
            />
            <Input 
              label="Location" 
              placeholder="City, Country"
              {...register("personal.address")} 
            />
            <Input 
              label="LinkedIn Profile" 
              placeholder="linkedin.com/in/username"
              {...register("personal.linkedin")} 
            />
          </div>
        </div>
      </Section>

      {/* PROFESSIONAL SUMMARY */}
      <Section 
        title="Professional Summary" 
        icon={<Award className="w-5 h-5" />}
        subtitle="Brief overview of your career goals, expertise, and key achievements"
      >
        <Textarea
          placeholder="Example: Experienced educator with 8+ years in curriculum development..."
          rows={5}
          maxLength={600}
          {...register("summary")}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate-500">Write 3-5 sentences highlighting your strengths</p>
          <p className="text-xs text-slate-500">{summaryText.length}/600</p>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section 
        title="Professional Experience" 
        icon={<Briefcase className="w-5 h-5" />}
        subtitle="Your work history, internships, and relevant positions"
      >
        {exp.fields.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            No experience added yet. Click "Add Experience" below.
          </div>
        )}
        {exp.fields.map((f, idx) => (
          <div key={f.id} className="relative bg-slate-50 rounded-lg border border-slate-200 p-6 mb-4 shadow-sm">
            <button
              type="button"
              onClick={() => exp.remove(idx)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition cursor-pointer"
              title="Remove"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Position / Role" 
                placeholder="e.g., Senior Manager, Nurse"
                {...register(`experience.${idx}.position`)} 
              />
              <Input 
                label="Company / Organization" 
                placeholder="e.g., ABC Corporation"
                {...register(`experience.${idx}.company`)} 
              />
              <Input 
                label="Start Date" 
                placeholder="Jan 2020"
                {...register(`experience.${idx}.start`)} 
              />
              <Input 
                label="End Date" 
                placeholder="Present or Dec 2023"
                {...register(`experience.${idx}.end`)} 
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Key Responsibilities & Achievements"
                  rows={4}
                  placeholder="• Managed a team of 10 professionals..."
                  {...register(`experience.${idx}.description`)}
                />
              </div>
            </div>
          </div>
        ))}
        <AddButton onClick={() => exp.append({})} label="Add Experience" />
      </Section>

      {/* EDUCATION */}
      <Section 
        title="Education" 
        icon={<GraduationCap className="w-5 h-5" />}
        subtitle="Academic qualifications, certifications, and training"
      >
        {edu.fields.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            No education added yet. Click "Add Education" below.
          </div>
        )}
        {edu.fields.map((f, idx) => (
          <div key={f.id} className="relative bg-slate-50 rounded-lg border border-slate-200 p-6 mb-4 shadow-sm">
            <button
              type="button"
              onClick={() => edu.remove(idx)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition cursor-pointer"
              title="Remove"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Degree / Qualification" 
                placeholder="e.g., Bachelor of Science, MBA"
                {...register(`education.${idx}.degree`)} 
              />
              <Input 
                label="Institution / University" 
                placeholder="e.g., Harvard University"
                {...register(`education.${idx}.institution`)} 
              />
              <Input 
                label="Start Year" 
                placeholder="2018"
                {...register(`education.${idx}.start`)} 
              />
              <Input 
                label="End Year" 
                placeholder="2022 or Expected 2025"
                {...register(`education.${idx}.end`)} 
              />
            </div>
          </div>
        ))}
        <AddButton onClick={() => edu.append({})} label="Add Education" />
      </Section>

      {/* SKILLS */}
      <Section 
        title="Skills & Competencies" 
        icon={<Award className="w-5 h-5" />}
        subtitle="Core skills, technical abilities, and professional competencies"
      >
        <Input 
          placeholder="Separate with commas. Examples: Patient Care, Microsoft Office..."
          {...register("skills")} 
        />
        <p className="text-xs text-slate-500 mt-2">List both technical and soft skills relevant to your field</p>
      </Section>

      {/* LANGUAGES */}
      <Section 
        title="Languages" 
        icon={<Globe className="w-5 h-5" />}
        subtitle="Languages you can speak, read, or write"
      >
        <Input 
          placeholder="Separate with commas. Examples: English (Native), Spanish (Fluent)"
          {...register("languages")} 
        />
      </Section>

      {/* INTERESTS */}
      <Section 
        title="Interests & Hobbies" 
        icon={<Heart className="w-5 h-5" />}
        subtitle="Personal interests that showcase your personality"
      >
        <Input 
          placeholder="Separate with commas. Examples: Photography, Volunteering, Reading"
          {...register("interests")} 
        />
      </Section>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-slate-200 sticky bottom-0 bg-white py-4 shadow-lg rounded-lg px-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Required fields:</span> Name, Title, Email, Phone
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all fields?")) {
                reset(data);
                setPhotoPreview(data.personal?.photo || null);
              }
            }}
            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-md font-medium
                       hover:bg-slate-50 hover:border-slate-400 
                       transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-800 text-white rounded-md font-medium shadow-md
                       hover:bg-slate-900 hover:shadow-lg 
                       transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Update Preview
          </button>
        </div>
      </div>
    </form>
  );
}

/* ----------------- Reusable Components ----------------- */

function Section({ title, icon, subtitle, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-white">{icon}</div>
          <div>
            <h3 className="font-bold text-lg tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm text-slate-200 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function Input({ label, required, ...rest }) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block mb-1.5 font-semibold text-sm text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      )}
      <input
        className="w-full px-4 py-2.5 border border-slate-300 rounded-md bg-white text-slate-800 text-sm
                   focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none 
                   transition-all placeholder-slate-400
                   hover:border-slate-400"
        {...rest}
      />
    </label>
  );
}

function Textarea({ label, required, ...rest }) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block mb-1.5 font-semibold text-sm text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      )}
      <textarea
        className="w-full px-4 py-2.5 border border-slate-300 rounded-md bg-white text-slate-800 text-sm
                   focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:outline-none 
                   transition-all placeholder-slate-400 resize-y
                   hover:border-slate-400"
        {...rest}
      />
    </label>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-2 px-4 py-3 text-sm font-medium bg-slate-100 text-slate-700 
                 border-2 border-dashed border-slate-300 rounded-md 
                 hover:bg-slate-700 hover:text-white hover:border-slate-700
                 transition-all duration-200 active:scale-98 cursor-pointer"
    >
      + {label}
    </button>
  );
}
