import React from 'react';

export function HarvardEliteTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  return (
    <div className="bg-white p-4 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-3 font-serif text-center text-[15px]">
      <div className="text-xl font-bold mb-1 text-gray-900">{personalInfo.fullName}</div>
      <div className="text-sm mb-2 text-gray-700">{personalInfo.email}</div>
      <div className="italic mb-2 text-gray-600">{personalInfo.summary}</div>
      <div className="border-t border-gray-300 pt-2 mt-2">
        <div className="font-bold text-gray-700 text-base mb-2">Experience</div>
        <ul className="list-disc pl-5 space-y-1 text-left">
          {experience.map((exp: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold">{exp.position} – {exp.company}</div>
              <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate} | {exp.location}</div>
              <div className="text-xs">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-300 pt-2 mt-2">
        <div className="font-bold text-gray-700 text-base mb-2">Education</div>
        <ul className="list-disc pl-5 space-y-1 text-left">
          {education.map((edu: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold">{edu.degree} – {edu.institution}</div>
              <div className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</div>
              <div className="text-xs">{edu.field}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-300 pt-2 mt-2">
        <div className="font-bold text-gray-700 text-base mb-2">Skills</div>
        <div className="flex flex-wrap gap-1 justify-center">
          {skills.map((skill: string, idx: number) => (
            <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>
      {references.length > 0 && (
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="font-bold text-gray-700 text-base mb-2">References</div>
          <ul className="list-disc pl-5 space-y-1 text-left">
            {references.map((ref: any, idx: number) => (
              <li key={idx}>{ref.name} – {ref.title}, {ref.company} ({ref.email})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 