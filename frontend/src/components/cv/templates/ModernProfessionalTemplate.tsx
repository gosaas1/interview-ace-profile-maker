// Modern, center-aligned, font-sans, indigo headings.
import React from 'react';
export function ModernProfessionalTemplate({ data }: { data: any }) {
  return (
    <div className="bg-white p-8 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-6 font-sans text-center text-[16px]">
      <div className="text-2xl font-extrabold mb-2">{data.personalInfo?.fullName}</div>
      <div className="text-base mb-3">{data.personalInfo?.email}</div>
      <div className="italic mb-4">{data.personalInfo?.summary}</div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">Experience</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {data.experience?.map((exp: any) => (
            <li key={exp.id}>
              <div><span className="font-semibold">{exp.position}</span> at {exp.company} <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span></div>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">Education</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {data.education?.map((edu: any) => (
            <li key={edu.id}>
              {edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span>
              {edu.gpa && <span className="ml-2 text-xs">GPA: {edu.gpa}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">Skills</div>
        <div>{Array.isArray(data.skills) ? data.skills.join(', ') : data.skills}</div>
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">Certifications</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {data.certifications?.map((cert: any) => (
            <li key={cert.id}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">Languages</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {data.languages?.map((lang: any) => (
            <li key={lang.id}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="font-bold text-indigo-700 text-lg mb-2">References</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {data.references?.map((ref: any) => (
            <li key={ref.id}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 