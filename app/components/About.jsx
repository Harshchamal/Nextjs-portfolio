import { assets, infoList, toolsData } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const About = ({isDarkMode}) => {
  return (
    <div id="about" className="w-full px-[12%] py-10 scroll-mt-20">
      <h4 className="text-center mb-2 text-lg font-Ovo">Introduction</h4>
      <h2 className="text-center text-5xl font-Ovo">About me</h2>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 my-20">
        {/* User Image Section */}
        <div className="flex-shrink-0">
          <Image
            src={assets.user_image}
            alt="user"
            className="rounded-3xl object-cover"
            width={320} // Ensure consistent size
            height={320}
            priority // Optimize loading
          />
        </div>

        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-10 max-w-2xl font-Ovo mx-auto lg:mx-0">
            I am Chamal Harsha, a final-year undergraduate student in Software Engineering at
            Cardiff Metropolitan University. Passionate about technology and software development, 
            I strive to learn and grow continuously. As a dedicated full-stack developer with a foundation in the MERN stack, I specialize in 
            developing scalable web applications. I enjoy collaborating with like-minded individuals, 
            exploring opportunities, and contributing to shaping the future of software engineering and enhancing user experiences. Let's connect and innovate together!
          </p>

          {/* Information Cards */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
            {infoList.map(({ icon, iconDark, title, description }, index) => (
              <li
                className="border border-gray-400 rounded-xl p-6 cursor-pointer 
                hover:bg-lightHover hover:-translate-y-1 duration-500 hover:shadow-black dark:border-white dark:hover:shadow-white dark:hover:bg-darkHover/50"
                key={index}
              >
                <Image src={isDarkMode ? iconDark  : icon} alt={title} className="w-7 mt-3 mx-auto" />
                <h3 className="my-4 font-semibold text-gray-700 dark:text-white">{title}</h3>
                <p className="text-gray-600 text-sm dark:text-white/80">{description}</p>
              </li>
            ))}
          </ul>

          {/* Tools Section */}
          <h4 className="my-6 text-gray-700 font-Ovo dark:text-white/80">Tools I use</h4>
          <ul className="flex flex-wrap justify-left gap-3 sm:gap-5">
            {toolsData.map((tool, index) => (
              <li
                className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 border 
                border-gray-400 rounded-lg cursor-pointer hover:-translate-y-1 duration-500"
                key={index}
              >
                <Image src={tool} alt="tool" className="w-5 sm:w-7" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
