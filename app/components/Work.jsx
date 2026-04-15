import React, { useState } from 'react';
import Image from 'next/image';
import { workData } from '@/assets/assets';
import ProjectModal from './ProjectModal';

const Work = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // ✅ Filter projects
  const filteredProjects =
    activeTab === 'all'
      ? workData
      : workData.filter((project) => project.category === activeTab);

  return (
    <div id='work' className='w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20'>

      {/* Heading */}
      <h2 className='text-center text-4xl font-Ovo'>My latest work</h2>
      <p className='text-center max-w-2xl mx-auto font-Ovo mt-4 mb-6 text-sm sm:text-base'>
        Explore a collection of projects showcasing my expertise in web development.
      </p>

      {/* ✅ Tabs */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {['all', 'web', 'uiux', 'wordpress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition 
              ${activeTab === tab
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
              className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer aspect-[4/3] group
                ${isLastOddItem ? 'lg:col-start-2' : ''}`}
              onClick={() => setSelectedProject(project)}
            >
              <Image
                src={project.bgImage}
                alt={project.title}
                fill
                className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <p className="text-white text-lg font-semibold">View Project</p>
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