import { assets, serviceData } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Services = () => {
  return (
    <div id='services' className='w-full px-6 sm:px-10 md:px-[12%] py-10 scroll-mt-20'>
      
      {/* Title */}
      <h2 className='text-center text-3xl sm:text-4xl md:text-5xl font-Ovo'>My services</h2>

      {/* Paragraph */}
      <p className='text-center max-w-2xl sm:max-w-3xl mx-auto font-Ovo mt-4 sm:mt-5 mb-8 sm:mb-12 text-sm sm:text-base'>
        Passionate Web Developer and Designer specializes in creating visually stunning, user-friendly websites with 
        sleek design and seamless functionality, bringing creativity and technical expertise to every project.
      </p>

      {/* Services Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 my-10'>
        {serviceData.map(({ icon, title, description, link }, index) => (
          <div
            key={index}
            className='border border-gray-300 rounded-2xl p-8 sm:p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 dark:border-white dark:hover:bg-darkHover/30 cursor-pointer'
          >
            <Image src={icon} alt='' className='w-10 h-10 mb-4' />
            <h3 className='text-lg sm:text-xl font-semibold mb-3 text-gray-700 dark:text-white'>{title}</h3>
            <p className='text-sm text-gray-600 leading-relaxed dark:text-white/80'>
              {description}
            </p>
            <a href={link} className='flex items-center gap-2 text-sm mt-5 font-semibold text-primary hover:underline'>
              Read more <Image alt='' src={assets.right_arrow} className='w-4' />
            </a>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Services
