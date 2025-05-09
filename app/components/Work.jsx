import React, { useState } from 'react';
import Image from 'next/image';
import { workData } from '@/assets/assets';
import ProjectModal from './ProjectModal';

const Work = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div id='work' className='w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20'>

      {/* Section Heading */}
      <h2 className='text-center text-4xl font-Ovo'>My Portfolio</h2>
      <p className='text-center max-w-2xl mx-auto font-Ovo mt-4 mb-10 text-sm sm:text-base'>
        Welcome to my development portfolio! Explore a collection of projects that showcase my expertise in web development and design.
      </p>

      {/* Project Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
  {workData.map((project, index) => {
    // Check if it's the last item AND the only one in the last row
    const isLastOddItem = index === workData.length - 1 && workData.length % 3 === 1;
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
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <p className="text-white text-lg font-semibold">View Project</p>
        </div>
      </div>
    );
  })}
</div>


      {/* Modal Popup */}
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
