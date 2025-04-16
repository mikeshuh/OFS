import React, { useRef, useEffect } from 'react';

import Navbar from '../components/Navbar';
//Why choose OFS image
import wheatField from '../assets/wheatField.jpg';



//icons
import reactIcon from '../assets/aboutpage/reactIcon.png';
import nodeIcon from '../assets/aboutpage/nodeIcon.png';
import mysqlIcon from '../assets/aboutpage/mysqlIcon.png';
import stripeIcon from '../assets/aboutpage/stripeIcon.svg';
import tailwindIcon from '../assets/aboutpage/tailwindIcon.svg';
import viteIcon from '../assets/aboutpage/viteIcon.png';
import redisIcon from '../assets/aboutpage/redisIcon.png';
import mapBoxIcon from '../assets/aboutpage/mapBoxIcon.png';
import expressIcon from '../assets/aboutpage/expressIcon.png';
import bullIcon from '../assets/aboutpage/bullIcon.png';
//team pictures
import rayProfile from '../assets/team/rayProfile.jpg';
import michaelProfile from '../assets/team/michaelProfile.jpg';
import dannyProfile from '../assets/team/dannyProfile.jpg';
import anProfile from '../assets/team/anProfile.jpg';
import trinityProfile from '../assets/team/trinityProfile.jpg';
import timothyProfile from '../assets/team/timothyProfile.jpg';
import teamPicture from '../assets/team/teamPicture.jpg';

//Image carousel
import 'swiper/css';
import 'swiper/element/css/free-mode';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode'; // If you want free mode styles
import { FreeMode, Autoplay } from 'swiper/modules';



function AboutPage() {

  //SVG for attention grabber
  const features = [

    {
      title: "Fast",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104a1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
    },
    {
      title: "Reliable",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path fillRule="evenodd" d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "On Demand",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.8 4.8" fill="currentColor">
        <circle cx="2.4" cy="2.4" r="2" stroke="currentColor" strokeWidth="0.3" fill="none"/>
        <line x1="2.4" y1="2.4" x2="2.4" y2="1.4" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round"/>
        <line x1="2.4" y1="2.4" x2="3.4" y2="2.4" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round"/>
        <circle cx="2.4" cy="2.4" r="0.15" fill="currentColor"/>
      </svg>
      ),
    },

  ];


  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Header */}
      <Navbar />

      {/* Attention Grabber */}
      <section className='container mx-auto text-center py-1 px-0 '>
        <div className="px-4 md:px-12 py-10">
          <div className="text-center ">
            <div className="flex items-center justify-center">
              <div className="border-t border-green-500 w-32"></div>
              <h2 className="mx-4 text-2xl text-green-600 italic font-medium">OFS Delivery Is</h2>
              <div className="border-t border-green-500 w-32"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-green-600 flex items-center justify-center mx-auto mb-4 max-w-[75px] h-[75px]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* why choose OFS section*/}
      <section className='container mx-auto px-6 py-12'>
        <div className='flex flex-col md:flex-row items-start'>
          <div className='md:w-1/2 mb-6 md:mb-0 md:mr-8'>
            <img src={wheatField} alt='Wheat Field' className='w-full drop-shadow-lg pointer-events-none user-select-none' />
          </div>
          <div className='md:w-1/2'>
            <h2 className='text-2xl font-semibold mb-4'>Why choose OFS?</h2>
            <p className='mb-4'>
              At OFS, we are dedicated to bringing you fresh, organic products at affordable prices. By sourcing locally, we proudly support nearby farms and communities, ensuring that every purchase helps strengthen your local economy.
            </p>
            <p classname=''>
              We prioritize your convenience with fast, reliable, and on-demand delivery, allowing you to spend more time on the things that matter most. As a bonus, orders under 20 lbs qualify for free delivery—no need to worry about extra fees on smaller purchases.
            </p>
            <p className='mt-4'>
              Clear communication is central to our service. All your past orders are safely stored and easily accessible, and you'll always receive real-time updates on your deliveries, giving you peace of mind from checkout to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* meet the team section */}
      <section className='container mx-auto text-center py-6 px-6'>
        <h1 className='text-4xl font-bold mb-8'>Meet the team behind OFS</h1>
        <div className='container mx-auto flex flex-col items-center justify-center gap-8 px-6'>
          <img src={teamPicture} alt='OFS Team' className='w-full rounded-sm object-cover pointer-events-none user-select-none' />
          <p className='text-lg mb-10'>Committed To Bringing You The Best </p>
        </div>

        <div className='container mx-auto grid grid-cols-3 grid-rows-2 gap-8 px-8  justify-items-center'>
        <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={anProfile} alt='An' className='max-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          An Ho
          </div>
          <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={trinityProfile} alt='Trinity' className='min-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          Trinity Manansala
          </div>
          <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={timothyProfile} alt='Timothy' className='min-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          Timothy Nguyen
          </div>
          <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={michaelProfile} alt='Michael' className='max-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          Michael Huh
          </div>
          <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={dannyProfile} alt='Danny' className='max-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          Danny Xu
          </div>
          <div className='flex flex-col items-center justify-center bg-white w-[300px] h-[300px] drop-shadow-lg'>
          <img src={rayProfile} alt='Ray' className='max-w-[200px] h-[200px] rounded-full object-cover pointer-events-none user-select-none' />
          Ray Zhang
          </div>
        </div>
      </section>


      {/* Image Carousel */}
      <h2 className='text-2xl font-semibold mb-4 text-center'>Technologies Used For This Website</h2>
      <style>
        {`
      .mySwiper {
        align-items: center;
        width: 100%;
        overflow:
      }

      .mySwiper .swiper-wrapper {
        display: flex;
        transition-timing-function: linear !important;
        align-items: center;
        width: fit-content;
        margin: 0 auto;
      }

      .mySwiper .swiper-slide {
        display: flex;
        justify-content: center;
      }
        `}
      </style>
      <Swiper
        modules={[FreeMode, Autoplay]} // Install the modules you want to use
        freeMode={true}
        slidesPerView={'auto'}
        spaceBetween={10}
        loop={true}
        noSwiping={true}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        simulateTouch={false}
        speed={5000}
        className="mySwiper"
      >
        <SwiperSlide className='flex justify-center max-w-[300px]'>
          <img src={reactIcon} alt='react' className='max-w-[150px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={bullIcon} alt='bull' className='max-w-[300px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={mysqlIcon} alt='mysql' className='max-w-[200px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={stripeIcon} alt='stripe' className='max-w-[200px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={nodeIcon} alt='node' className='max-w-[200px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={tailwindIcon} alt='tailwind' className='max-w-[200px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={redisIcon} alt='redis' className='max-w-[300px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={viteIcon} alt='vite' className='max-w-[150px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={expressIcon} alt='express' className='max-w-[200px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>
        <SwiperSlide className='flex justify-center  max-w-[300px]'>
          <img src={mapBoxIcon} alt='mapbox' className='max-w-[300px] h-[200px] rounded-lg object-contain pointer-events-none user-select-none' />
        </SwiperSlide>

      </Swiper>



      {/* Footer */}
      <footer className='bg-gray-100 py-4 text-center'>
        <p className='text-sm text-gray-600'>OFS is located at 1 Washington Sq, San Jose, California, United States, 95192 and delivers within a 25 mile radius.</p>
      </footer>
    </div>
  );
}

export default AboutPage;
