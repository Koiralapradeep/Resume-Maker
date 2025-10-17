import { useResumeStore } from "../store/useResumeStore";
import ModernTemplate from "./ModernTemplate";

export default function ResumePreview(){
  const data = useResumeStore(s=>s.data);
  const template = useResumeStore(s=>s.template);

  if (template === "modern") return <ModernTemplate data={data} />;
  return <div className="p-6">Template not implemented</div>;
}
