import React from 'react';
export function ModernMinimalTemplate({ data }: { data: any }) {
  return (
    <div className="bg-slate-50 p-6 rounded shadow-inner text-slate-800 max-w-2xl mx-auto space-y-4">
      <div className="text-xl font-semibold mb-1">{data.personalInfo?.fullName}</div>
      <div className="text-sm mb-2">{data.personalInfo?.email}</div>
      <div className="italic mb-2">{data.personalInfo?.summary}</div>
      <div className="pt-2 mt-2">
        <div className="font-bold">Experience</div>
        <ul className="list-none pl-0 space-y-2">
          {data.experience?.map((exp: any) => (
            <li key={exp.id} className="mb-1">
              <div><span className="font-medium">{exp.position}</span> at <span>{exp.company}</span> <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span></div>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-2 mt-2">
        <div className="font-bold">Education</div>
        <ul className="list-none pl-0 space-y-2">
          {data.education?.map((edu: any) => (
            <li key={edu.id}>
              {edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span>
              {edu.gpa && <span className="ml-2 text-xs">GPA: {edu.gpa}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-2 mt-2">
        <div className="font-bold">Skills</div>
        <div>{Array.isArray(data.skills) ? data.skills.join(', ') : data.skills}</div>
      </div>
      <div className="pt-2 mt-2">
        <div className="font-bold">Certifications</div>
        <ul className="list-none pl-0 space-y-1">
          {data.certifications?.map((cert: any) => (
            <li key={cert.id}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      <div className="pt-2 mt-2">
        <div className="font-bold">Languages</div>
        <ul className="list-none pl-0 space-y-1">
          {data.languages?.map((lang: any) => (
            <li key={lang.id}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      <div className="pt-2 mt-2">
        <div className="font-bold">References</div>
        <ul className="list-none pl-0 space-y-1">
          {data.references?.map((ref: any) => (
            <li key={ref.id}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 