// import { useResumeStore } from "../store/useResumeStore";

// export default function TemplateSelector() {
//   const template = useResumeStore((s) => s.template);
//   const setTemplate = useResumeStore((s) => s.setTemplate);

//   return (
//     <div className="flex gap-3 items-center">
//       <span className="text-sm text-gray-600">Template:</span>
//       <select
//         value={template}
//         onChange={(e) => setTemplate(e.target.value)}
//         className="border rounded px-3 py-2"
//       >
//         <option value="modern">Modern</option>
//         <option value="classic">Classic</option>
//         <option value="creative">Creative</option>
//       </select>
//     </div>
//   );
// }
