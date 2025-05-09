import React from 'react';
import Image from 'next/image';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-2xl w-full max-w-3xl shadow-2xl relative">

        {/* Close Button */}
        <button
          className="absolute top-4 right-5 text-2xl font-bold hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

        {/* Image */}
        <div className="relative w-full h-[350px] sm:h-[350px] md:h-[550px] rounded-xl overflow-hidden mb-4">
          <Image
            src={project.bgImage}
            alt={project.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base mb-6">{project.description}</p>

        {/* View Project Link */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium hover:text-blue-800"
        >
          View Project
        </a>
      </div>
    </div>
  );
};

export default ProjectModal;
