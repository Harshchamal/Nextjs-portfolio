import React from 'react';
import Image from 'next/image';
import { assets, workData } from '@/assets/assets';

const Work = ({ isDarkMode }) => {
  return (
    <div id='work' className='w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20'>
      
      {/* Section Title */}
      <h2 className='text-center text-3xl sm:text-4xl md:text-5xl font-Ovo'>My Portfolio</h2>

      {/* Section Description */}
      <p className='text-center max-w-2xl sm:max-w-3xl mx-auto font-Ovo mt-4 sm:mt-5 mb-8 sm:mb-12 text-sm sm:text-base'>
        Welcome to my development portfolio! Explore a collection of projects that showcase my expertise in web development and design.
      </p>

      {/* Projects Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
  {workData.map((project, index) => (
    <div
      key={index}
      className='relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-all duration-300'
    >
      {/* Background image with new height */}
      <div
        className='w-full h-72 sm:h-80 md:h-[400px] bg-cover bg-center'
        style={{ backgroundImage: `url(${project.bgImage})` }}
      ></div>

      {/* Hover overlay with icon */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
      >
        <Image src={assets.send_icon} alt="View Project" className="w-12" />
      </a>
    </div>
  ))}
</div>


      {/* Show More Button */}
      <a
        href=''
        className='w-max flex items-center justify-center gap-2 
        text-gray-700 border-[0.5px] border-gray-700 rounded-full py-3 px-10 mx-auto mt-14 hover:bg-lightHover duration-500 dark:text-white dark:border-white dark:hover:bg-darkHover'
      >
        Show more
        <Image src={isDarkMode ? assets.right_arrow_bold_dark : assets.right_arrow_bold} alt='Right arrow' className='w-4' />
      </a>

    </div>
  );
};

export default Work;
