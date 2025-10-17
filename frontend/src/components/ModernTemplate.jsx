import React from "react";
import { motion } from "framer-motion";
import { useResumeStore } from "../store/useResumeStore";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Heart,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export default function ModernTemplate() {
  const data = useResumeStore((s) => s.data);
  const { personal, summary, education, experience, skills, languages, interests } = data;

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const resolvedPhoto =
    personal?.photo?.startsWith("http")
      ? personal.photo
      : personal?.photo
        ? `${backendURL.replace(/\/$/, "")}/${personal.photo.replace(/^\/+/, "")}`
        : null;

  return (
    <motion.div
      className="w-full max-w-[210mm] mx-auto bg-white shadow-lg font-['Inter']"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ fontSize: "10pt", lineHeight: "1.5" }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white px-12 py-8">
        <div className="flex items-start gap-6">
          {resolvedPhoto && (
            <img
              src={resolvedPhoto}
              alt="Profile"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {personal?.name || "Full Name"}
            </h1>
            <p className="text-lg text-slate-200 mb-3 font-medium">
              {personal?.title || "Professional Title"}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {personal?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="flex-shrink-0" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal?.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{personal.address}</span>
                </div>
              )}
              {data.personal?.linkedin && (
                <a
                  href={data.personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-200 hover:text-white transition cursor-pointer"
                >
                  <FaLinkedin className="w-4 h-4 text-blue-300" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[35%_65%] gap-0">
        {/* Left Sidebar */}
        <div className="bg-slate-50 px-6 py-8 space-y-6">
          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-300 flex items-center gap-2">
                <Award size={14} />
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-white text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-300 flex items-center gap-2">
                <Globe size={14} />
                Languages
              </h2>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {languages.map((lang, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Globe size={12} className="text-slate-500 flex-shrink-0" />
                    <span>{lang}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {interests?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-300 flex items-center gap-2">
                <Heart size={14} />
                Interests
              </h2>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {interests.map((it, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Heart size={12} className="text-slate-500 flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Professional Summary */}
          {summary && (
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
                <Award size={16} />
                Professional Summary
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
                <Briefcase size={16} />
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-slate-800">
                        {exp.position}
                      </h3>
                      <span className="text-xs text-slate-600 font-medium whitespace-nowrap ml-4">
                        {exp.start} - {exp.end}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-2">
                      {exp.company}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
                <GraduationCap size={16} />
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-slate-800">
                        {edu.degree}
                      </h3>
                      <span className="text-xs text-slate-600 font-medium whitespace-nowrap ml-4">
                        {edu.start} - {edu.end}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
