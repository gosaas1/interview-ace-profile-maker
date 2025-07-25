import React from 'react';

export function AttractiveCVTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  return (
    <div className="bg-white p-8 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-6 font-[Inter]">
      <div className="text-2xl font-bold mb-1 text-blue-900 text-center">{personalInfo.fullName}</div>
      <div className="text-sm mb-2 text-blue-700 text-center">{personalInfo.email}</div>
      <div className="italic mb-2 text-gray-600 text-center">{personalInfo.summary}</div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <div className="font-bold text-blue-700 text-lg mb-2">Experience</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {experience.map((exp: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold">{exp.position} – {exp.company}</div>
              <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate} | {exp.location}</div>
              <div className="text-xs">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <div className="font-bold text-blue-700 text-lg mb-2">Education</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {education.map((edu: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold">{edu.degree} – {edu.institution}</div>
              <div className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</div>
              <div className="text-xs">{edu.field}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <div className="font-bold text-blue-700 text-lg mb-2">Skills</div>
        <div className="flex flex-wrap gap-1 mb-4">
          {skills.map((skill: string, idx: number) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>
          ))}
        </div>
      </div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <div className="font-bold text-blue-700 text-lg mb-2">Certifications</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {certifications.map((cert: any, idx: number) => (
            <li key={idx}>{cert.name} – {cert.issuer} ({cert.date})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <div className="font-bold text-blue-700 text-lg mb-2">Languages</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {languages.map((lang: any, idx: number) => (
            <li key={idx}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      {references.length > 0 && (
        <div className="border-t border-blue-200 pt-4 mt-4">
          <div className="font-bold text-blue-700 text-lg mb-2">References</div>
          <ul className="list-disc pl-8 space-y-3 text-left">
            {references.map((ref: any, idx: number) => (
              <li key={idx}>{ref.name} – {ref.title}, {ref.company} ({ref.email})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 