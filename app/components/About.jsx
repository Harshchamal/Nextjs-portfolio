import { assets, toolsData } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';

const skillsData = [
  { category: 'Languages', skills: [
    { name: 'HTML', level: 92 },
    { name: 'CSS', level: 85 },
    { name: 'JAVASCRIPT', level: 78 },
    { name: 'TAILWIND CSS', level: 80 },
    { name: 'REACT', level: 75 },
    { name: 'PHP', level: 65 },
  ]},
  { category: 'Tools', skills: [
    { name: 'FIGMA', level: 90 },
    { name: 'WORDPRESS', level: 90 },
    { name: 'PHOTOSHOP', level: 99 },
  ]},
];

const educationData = [
  {
    period: '2024 – May 2025',
    degree: "Bachelor's degree, software engineering",
    school: 'Cardiff Metropolitan University',
    grade: 'Grade: Second Class Upper Division',
  },
  {
    period: '2022 – Dec 2023',
    degree: 'Higher Diploma in software engineering',
    school: 'Cardiff Metropolitan University',
    grade: 'Grade: Merit',
  },
  {
    period: '2022 – January 2023',
    degree: 'ICBT Kandy Campus',
    school: 'ICBT Kandy Campus',
    grade: 'Grade: Distinction',
  },
  {
    period: '2021 December',
    degree: 'G.C.E Ordinary Level (O/L)',
    school: 'Sri chandananda Buddist collage, Kandy',
    grade: 'Grade: Passed',
  },
];

const About = ({ isDarkMode }) => {
  return (
    <div id="about" className="w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20">

      {/* Section Title */}
      <h4 className="text-center mb-2 text-base font-Ovo text-gray-500 dark:text-gray-400">
        Introduction
      </h4>
      <h2 className="text-center text-4xl sm:text-5xl font-Ovo mb-6 dark:text-white">
        About me
      </h2>

      {/* Intro Paragraph */}
      <p className="text-center max-w-3xl mx-auto font-Ovo text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-300 mb-14">
        I am a UI UX Designer and WordPress Developer passionate about creating user-centered digital experiences.
        I focus on designing clean interfaces, improving usability, and building responsive websites that deliver real value to users and businesses.
      </p>

      {/* Two Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* ── Skills Card ── */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 dark:bg-darkHover/30">
          {/* Card Header */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Image
                src={isDarkMode ? assets.code_icon_dark : assets.code_icon}
                alt="Skills"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h3 className="text-xl font-Ovo dark:text-white">Skills</h3>
              <p className="text-xs text-gray-400 mt-0.5">Technologies I work with</p>
            </div>
          </div>

          {/* Skill Bars */}
          {skillsData.map((group) => (
            <div key={group.category} className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest mb-3">
                {group.category}
              </p>
              {group.skills.map((skill) => (
                <div key={skill.name} className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wider mb-1.5">
                    {skill.name}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Education Card ── */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 dark:bg-darkHover/30">
          {/* Card Header */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Image
                src={isDarkMode ? assets.edu_icon_dark : assets.edu_icon}
                alt="Education"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h3 className="text-xl font-Ovo dark:text-white">Education</h3>
              <p className="text-xs text-gray-400 mt-0.5">My academic journey</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-0">
            {educationData.map((item, index) => (
              <div key={index} className="flex gap-4">
                {/* Dot + Line */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-300 flex-shrink-0 mt-1" />
                  {index < educationData.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6">
                  <p className="text-xs text-gray-400 mb-1">{item.period}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-0.5">
                    {item.degree}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    {item.school}
                  </p>
                  <p className="text-xs text-gray-400">{item.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools / Skills Icons Row */}
      <div className="mt-14">
        <h4 className="text-center text-sm text-gray-500 dark:text-gray-400 font-Ovo mb-6 tracking-wide">
          My skills
        </h4>
        <ul className="flex flex-wrap justify-center gap-4">
          {toolsData.map((tool, index) => (
            <li
              key={index}
              className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 dark:border-gray-700 
              rounded-xl flex items-center justify-center cursor-pointer 
              hover:scale-110 hover:shadow-md transition-all duration-300 
              dark:bg-darkHover/20"
            >
              <Image src={tool} alt="tool" className="w-7 sm:w-8" />
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default About;