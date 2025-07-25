import React from 'react';
export function TwoColumnExecutiveTemplate({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded shadow border max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="text-2xl font-bold mb-1">{data.personalInfo?.fullName}</div>
        <div className="text-sm mb-2">{data.personalInfo?.email}</div>
        <div className="mb-2">{data.personalInfo?.summary}</div>
        <div className="font-bold mt-4 mb-1">Skills</div>
        <div className="flex flex-wrap gap-1 mb-4">
          {data.skills?.map((skill: string, idx: number) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>
          ))}
        </div>
        <div className="font-bold mb-1">Certifications</div>
        <ul className="list-disc pl-5 mb-4">
          {data.certifications?.map((cert: any) => (
            <li key={cert.id}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
        <div className="font-bold mb-1">Languages</div>
        <ul className="list-disc pl-5 mb-4">
          {data.languages?.map((lang: any) => (
            <li key={lang.id}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="font-bold mb-1">Experience</div>
        <ul className="list-disc pl-5 mb-4">
          {data.experience?.map((exp: any) => (
            <li key={exp.id}>
              <span className="font-semibold">{exp.position}</span> at {exp.company} <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
        <div className="font-bold mb-1">Education</div>
        <ul className="list-disc pl-5 mb-4">
          {data.education?.map((edu: any) => (
            <li key={edu.id}>{edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span></li>
          ))}
        </ul>
        <div className="font-bold mb-1">References</div>
        <ul className="list-disc pl-5 mb-4">
          {data.references?.map((ref: any) => (
            <li key={ref.id}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 