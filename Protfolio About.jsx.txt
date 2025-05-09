import { assets, infoList, toolsData } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';

const About = ({ isDarkMode }) => {
  return (
    <div id="about" className="w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20">
      {/* Section Title */}
      <h4 className="text-center mb-2 text-base sm:text-lg font-Ovo">Introduction</h4>
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-Ovo">About me</h2>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-10 my-12 md:my-16">
        
        {/* Paragraph */}
        <p className="text-center mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl font-Ovo text-sm sm:text-base leading-relaxed">
          I am a dedicated Software Engineering student who has recently completed my final year project and am awaiting results.
          I’m passionate about coding, full-stack development, and problem-solving. I enjoy learning new technologies and applying
          them to real-world web projects. My goal is to contribute to innovative digital solutions while continuously growing as a developer.
        </p>

        {/* Wireframe Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl w-full">
          {infoList.map(({ icon, iconDark, title, description }, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-white rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 dark:bg-darkHover/30"
            >
              <Image
                src={isDarkMode ? iconDark : icon}
                alt={title}
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700 dark:text-white">{title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm dark:text-white/80 whitespace-pre-line">{description}</p>
            </div>
          ))}
        </div>
{/* Tools Section */}
<div className="w-full max-w-5xl mt-12 sm:mt-16">
  <h4 className="my-6 sm:my-8 text-center text-gray-700 font-Ovo text-base sm:text-lg dark:text-white/80">
    Tools and languages I use
  </h4>
  <ul className="flex flex-wrap justify-center gap-x-6 gap-y-6">
    {toolsData.map((tool, index) => (
      <li
        key={index}
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border 
        border-gray-300 dark:border-white rounded-lg cursor-pointer hover:scale-110 hover:shadow-md 
        transition-all duration-300"
      >
        <Image src={tool} alt="tool" className="w-7 sm:w-8" />
      </li>
    ))}
  </ul>
</div>



      </div>
    </div>
  );
};

export default About;
