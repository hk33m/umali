'use client';

import { useState } from 'react';
import Header from '@/components/header'
import Hero from '@/components/hero'
import Products from '@/components/products'
import Features from '@/components/features'
import Reviews from '@/components/reviews'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
// import HeroAnimation from "@/components/HeroAnimation";
import BannerSlider from '@/components/bannerSlider'
import Offers from '@/components/offers';
import FloatingContact from '@/components/floating-contact';
import OurStory from '@/components/ourstory';
export default function Home() {
  

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Header onCartClick={() => setIsCartOpen(true)} />
        {/* <HeroAnimation /> */}
      <FloatingContact />
      <BannerSlider/>
      <Hero />
      <Products />
      <Offers />
      <Features />
      <OurStory />
      <Reviews />
      <Contact />
      <Footer />
      
    </main>
  )
}
