// 2025 Best Practice: ATS + Recruiter Optimized, white background, subtle accents only.
import React from 'react';
export function HarvardClassicTemplate({ data }: { data: any }) {
  return (
    <div className="bg-white p-6 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-4">
      <div className="text-lg font-bold text-center mb-1">{data.personalInfo?.fullName}</div>
      <div className="text-xs text-center mb-2">{data.personalInfo?.email}</div>
      <div className="italic text-center mb-2">{data.personalInfo?.summary}</div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">Experience</div>
        <ul className="list-disc pl-5 text-xs space-y-2">
          {data.experience?.map((exp: any) => (
            <li key={exp.id}>
              <div><span className="font-semibold">{exp.position}</span> at {exp.company} <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span></div>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">Education</div>
        <ul className="list-disc pl-5 text-xs space-y-2">
          {data.education?.map((edu: any) => (
            <li key={edu.id}>
              {edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span>
              {edu.gpa && <span className="ml-2 text-xs">GPA: {edu.gpa}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">Skills</div>
        <div>{Array.isArray(data.skills) ? data.skills.join(', ') : data.skills}</div>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">Certifications</div>
        <ul className="list-disc pl-5 text-xs space-y-1">
          {data.certifications?.map((cert: any) => (
            <li key={cert.id}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">Languages</div>
        <ul className="list-disc pl-5 text-xs space-y-1">
          {data.languages?.map((lang: any) => (
            <li key={lang.id}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700 text-xs">References</div>
        <ul className="list-disc pl-5 text-xs space-y-1">
          {data.references?.map((ref: any) => (
            <li key={ref.id}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 