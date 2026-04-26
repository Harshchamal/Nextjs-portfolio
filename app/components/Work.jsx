import React, { useState } from 'react';
import Image from 'next/image';
import { workData } from '@/assets/assets';
import ProjectModal from './ProjectModal';

const Work = ({ isDarkMode }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  // ✅ Default tab (IMPORTANT FIX)
  const [activeTab, setActiveTab] = useState('web');

  // ✅ Filter projects (NO "all")
  const filteredProjects = workData.filter(
    (project) => project.category === activeTab
  );

  return (
    <div
      id='work'
      className='w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20 dark:bg-[#14001f]'
    >

      {/* Heading */}
      <h2 className='text-center text-4xl font-Ovo text-black dark:text-white'>
        My latest work
      </h2>

      <p className='text-center max-w-2xl mx-auto font-Ovo mt-4 mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-300'>
        Explore a collection of projects showcasing my expertise in web development.
      </p>

      {/* ✅ Tabs (ONLY 3 tabs) */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {[ 'web' ,'uiux', 'wordpress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition 
              ${
                activeTab === tab
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {filteredProjects.map((project, index) => {
          const isLastOddItem =
            index === filteredProjects.length - 1 &&
            filteredProjects.length % 3 === 1;

          return (
            <div
              key={index}
              className={`bg-white dark:bg-[#1a0026] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer transition-transform duration-200 hover:scale-105
              ${isLastOddItem ? 'lg:col-start-2' : ''}`}
              onClick={() => setSelectedProject(project)}
            >

              {/* Project Image */}
              <div className='relative w-full aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700'>
                <Image
                  src={project.bgImage}
                  alt={project.title}
                  fill
                  className='object-cover w-full h-full'
                />
              </div>

              {/* Card Content */}
              <div className='p-5'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                  {project.title}
                </h3>

                <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
                  {project.description}
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-2'>
                  {project.tools && project.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full font-medium'
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Work;