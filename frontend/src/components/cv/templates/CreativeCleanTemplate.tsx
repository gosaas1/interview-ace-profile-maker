import React from 'react';

export function CreativeCleanTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  return (
    <div className="bg-white p-8 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-6 font-[Lato]">
      <div className="text-2xl font-bold mb-1 text-purple-900">{personalInfo.fullName}</div>
      <div className="text-sm mb-2 text-gray-700">{personalInfo.email}</div>
      <div className="italic mb-2 text-gray-600">{personalInfo.summary}</div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">Experience</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {experience.map((exp: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold text-purple-700">{exp.position}</div>
              <div className="text-gray-600">{exp.company} | {exp.location} | {exp.startDate} - {exp.endDate}</div>
              <div>{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">Education</div>
        <ul className="list-disc pl-8 space-y-3 text-left">
          {education.map((edu: any, idx: number) => (
            <li key={idx}>
              <div className="font-semibold text-purple-700">{edu.degree} in {edu.field}</div>
              <div className="text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</div>
              <div>GPA: {edu.gpa}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">Skills</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {skills.map((skill: string, idx: number) => (
            <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">Certifications</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {certifications.map((cert: any, idx: number) => (
            <li key={idx}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">Languages</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {languages.map((lang: any, idx: number) => (
            <li key={idx}>{lang.language} ({lang.proficiency})</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-purple-200 pt-4 mt-4">
        <div className="font-bold text-purple-600 text-lg mb-2">References</div>
        <ul className="list-disc pl-8 space-y-2 text-left">
          {references.map((ref: any, idx: number) => (
            <li key={idx}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 