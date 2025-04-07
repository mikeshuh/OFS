import React, { useRef, useEffect } from 'react';

import Navbar from '../components/Navbar';
import deliveryVanTrunk from '../assets/deliveryVanTrunk.jpg';
import fruitImage from '../assets/fruits.jpg';
import { register } from 'swiper/element/bundle'



register();

function AboutPage() {
  const imageCarousel = useRef(null);

  useEffect(() => {
    const imageCarouselParams = {
      slidesPerView: 3,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 4500,
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    };

    Object.assign(imageCarousel.current, imageCarouselParams);

    imageCarousel.current.initialize();
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Header */}
      <Navbar />

      {/* Attention Grabber */}
      <section className='container mx-auto text-center py-6 px-6 '>
        <h1 className='text-4xl font-bold mb-8'>Here At OFS Delivery Is</h1>

        <section className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 '>
          <div className='relative flex justify-center'>
            <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[350px] h-[350px] rounded-lg object-cover' />
            <div className='absolute inset-0 flex items-center justify-center text-white'>
              <p className='text-2xl font-bold' style={{ textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Fast</p>
            </div>
          </div>
          <div className='relative flex justify-center'>
            <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[350px] h-[350px] rounded-lg object-cover' />
            <div className='absolute inset-0 flex items-center justify-center text-white'>
              <p className='text-2xl font-bold' style={{ textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>Reliable</p>
            </div>
          </div>
          <div className='relative flex justify-center'>
            <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[350px] h-[350px] rounded-lg object-cover' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='absolute inset-0 flex items-center justify-center text-white'>
                <p className='text-2xl font-bold' style={{ textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>On Demand</p>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className='container mx-auto px-6 py-12'>
        <div className='flex flex-col md:flex-row items-start'>
          <div className='md:w-1/2 mb-6 md:mb-0 md:mr-8'>
            <img src={fruitImage} alt='Fruits Image' className='w-full rounded-lg' />
          </div>

          <div className='md:w-1/2'>
            <h2 className='text-2xl font-semibold mb-4'>Why choose OFS?</h2>
            <p className='mb-4'>
              Here at OFS we are committed to providing quality and organic products that are affordable and fresh. Our products are locally sourced so by supporting us you support the farms and communties near you.
            </p>
            <p classname=''>
              We strive to provide fast, reliable and on demand delivery to save you time to do things that really matter. In order to ensure convenience any order under 20lbs qualiies for free delivery meaning you don't have to worry about flat fees on small orders.
            </p>
            <p className='mt-4'>
              We believe in clear communication and that means all your orders are saved for you to see. We also provide real time updates to the state of your delivery so you can be assured that your delivery is on the way.
            </p>

          </div>
        </div>
      </section>

      <section className='container mx-auto text-center py-6 px-6'>
        <h1 className='text-4xl font-bold mb-8'>Meet the team behind OFS</h1>
        <div className='container mx-auto flex flex-col items-center justify-center gap-8 px-6'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[1000px] h-[600px] rounded-sm object-cover' />
          <p className='text-lg mb-10'>Committed To Bringing You The Best At OFS</p>
        </div>

        <div className='container mx-auto grid grid-cols-3 grid-rows-2 gap-8 px-6 items-center justify-center'>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          An Manager
          </div>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          Trinity Manager
          </div>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          Timothy Manager
          </div>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          Micheal Manager
          </div>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          Danny Manager
          </div>
          <div className='flex flex-col items-center justify-center'>
          <img src={deliveryVanTrunk} alt='Delivery Van' className='max-w-[200px] h-[200px] rounded-full object-cover' />
          Ray Manager
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className='container mx-auto px-6 py-12'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Technologies Used For This Website</h2>
        <swiper-container ref={imageCarousel} className='myswiper' autoplay>
          <swiper-slide>
            <img src={fruitImage} alt='Product 1' className='w-full rounded-lg' />
          </swiper-slide>
          <swiper-slide>
            <img src={deliveryVanTrunk} alt='Product 2' className='w-full rounded-lg' />
          </swiper-slide>
          <swiper-slide>
            <img src={fruitImage} alt='Product 3' className='w-full rounded-lg' />
          </swiper-slide>
          <swiper-slide>
            <img src={deliveryVanTrunk} alt='Product 4' className='w-full rounded-lg' />
          </swiper-slide>
        </swiper-container>
      </section>

      {/* Footer */}
      <footer className='bg-gray-100 py-4 text-center'>
        <p className='text-sm text-gray-600'>OFS is located at XXXXX Street and delivers within a 500 mile radius.</p>
      </footer>
    </div>
  );
}

export default AboutPage;