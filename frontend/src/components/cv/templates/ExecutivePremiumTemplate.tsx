import React from 'react';

export function ExecutivePremiumTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded shadow border max-w-4xl mx-auto font-[Inter]">
      {/* Left Column: Personal Info, Skills, Languages, Certifications */}
      <div className="space-y-6 order-2 md:order-1">
        <div>
          <div className="text-2xl font-bold mb-1 text-blue-900 text-right">{personalInfo.fullName}</div>
          <div className="text-sm text-blue-700 mb-2 text-right">{personalInfo.email}</div>
          <div className="italic text-gray-600 mb-2 text-right">{personalInfo.summary}</div>
        </div>
        <div>
          <div className="font-bold text-blue-700 mb-1 text-right">Skills</div>
          <div className="flex flex-wrap gap-1 mb-2 justify-end">
            {skills.map((skill: string, idx: number) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold text-blue-700 mb-1 text-right">Languages</div>
          <ul className="list-disc pl-5 text-xs text-right">
            {languages.map((lang: any, idx: number) => (
              <li key={idx}>{lang.language} ({lang.proficiency})</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold text-blue-700 mb-1 text-right">Certifications</div>
          <ul className="list-disc pl-5 text-xs text-right">
            {certifications.map((cert: any, idx: number) => (
              <li key={idx}>{cert.name} – {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Right Column: Experience, Education, References */}
      <div className="space-y-6 order-1 md:order-2">
        <div>
          <div className="font-bold text-blue-700 mb-1">Experience</div>
          <ul className="list-disc pl-5 text-xs">
            {experience.map((exp: any, idx: number) => (
              <li key={idx}>
                <div className="font-semibold">{exp.position} – {exp.company}</div>
                <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate} | {exp.location}</div>
                <div className="text-xs">{exp.description}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold text-blue-700 mb-1">Education</div>
          <ul className="list-disc pl-5 text-xs">
            {education.map((edu: any, idx: number) => (
              <li key={idx}>
                <div className="font-semibold">{edu.degree} – {edu.institution}</div>
                <div className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</div>
                <div className="text-xs">{edu.field}</div>
              </li>
            ))}
          </ul>
        </div>
        {references.length > 0 && (
          <div>
            <div className="font-bold text-blue-700 mb-1">References</div>
            <ul className="list-disc pl-5 text-xs">
              {references.map((ref: any, idx: number) => (
                <li key={idx}>{ref.name} – {ref.title}, {ref.company} ({ref.email})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 