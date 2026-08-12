'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCampaigns } from '@/hooks/useCampaigns';
import CampaignCard from '@/components/campaign/CampaignCard';
import { Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/utils/constants';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HomeClient() {
  const { data, isLoading } = useCampaigns({ limit: 6, sort: 'most-funded', status: 'approved' });
  const campaigns = data?.campaigns || [];
  const [activeStep, setActiveStep] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto transition steps in How It Works if user is idle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroBanners = [
    {
      id: 1,
      title: "Bring Visionary Tech to Life",
      subtitle: "Join the revolution. Back pioneering engineers, open-source wizards, and sustainable innovators shaping tomorrow.",
      tag: "Technology & Innovation",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
      cta: "Explore Tech",
      link: `${ROUTES.CAMPAIGNS}?category=technology`
    },
    {
      id: 2,
      title: "Strengthen Communities Together",
      subtitle: "Fund neighborhood gardens, clean water stations, literacy libraries, and community centers globally.",
      tag: "Social Impact & Community",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
      cta: "Fund Causes",
      link: `${ROUTES.CAMPAIGNS}?category=community`
    },
    {
      id: 3,
      title: "Fuel Creative & Artistic Journeys",
      subtitle: "Empower indie game devs, independent filmmakers, designers, and painters to bypass the middlemen.",
      tag: "Creative Arts & Design",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200",
      cta: "Discover Art",
      link: `${ROUTES.CAMPAIGNS}?category=art`
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Founder, EcoPulse",
      quote: "CrowdFund completely transformed our product launch. We reached our funding goal in just 12 days, and the community support has been absolutely mind-blowing!",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      campaign: "Solar Charger Backpack"
    },
    {
      name: "Marcus Chen",
      role: "Director, OasisFlow",
      quote: "Thanks to this platform, we installed 5 water filters in local villages. Transparent funding and easy payouts made all the difference in gaining trust.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      campaign: "Clean Water for Villages"
    },
    {
      name: "Elena Rostova",
      role: "Lead Dev, StarRift Games",
      quote: "I was skeptical about crowdfunding at first, but the community here is incredibly warm. We didn't just raise credits; we built a passionate fanbase.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      campaign: "StarRift: Retro Space RPG"
    },
    {
      name: "David Koomson",
      role: "Environmental Advocate",
      quote: "The process was seamless from start to finish. CrowdFund gave us the visibility we needed to plant over 10,000 trees in urban areas.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      campaign: "Urban Green canopy"
    }
  ];

  const steps = [
    {
      id: 0,
      title: "1. Create Your Story",
      desc: "Define your funding target, describe your roadmap, and upload eye-catching images to illustrate your vision.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 1,
      title: "2. Spread the Word",
      desc: "Use our campaign dashboard to generate links, share updates on social media, and connect with early believers.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "3. Gather Contributions",
      desc: "Backers from around the globe pledge credits to your project in exchange for exciting rewards and unique tier perks.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "4. Claim & Build",
      desc: "Once your campaign milestones are met, securely withdraw your credits and start building your dream project.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const categoryCards = [
    { value: 'technology', label: 'Technology', desc: 'Hardware, software, robotics, and clean tech projects.', icon: '🔌', count: '12 active' },
    { value: 'education', label: 'Education', desc: 'Books, tools, platforms, and educational support.', icon: '📖', count: '8 active' },
    { value: 'health', label: 'Health', desc: 'Medical devices, healthcare solutions, and wellness.', icon: '❤️', count: '5 active' },
    { value: 'art', label: 'Art & Design', desc: 'Painting, sculpture, fashion, and visual arts.', icon: '🎨', count: '9 active' },
    { value: 'community', label: 'Community', desc: 'Local initiatives, social spaces, and aid.', icon: '🤝', count: '14 active' },
    { value: 'environment', label: 'Environment', desc: 'Conservation, renewable energy, and cleanups.', icon: '🌱', count: '6 active' }
  ];

  return (
    <div className="bg-cf-cream min-h-screen text-cf-dark pb-1">
      {/* 1. Hero Section Slider */}
      <section className="relative w-full h-[620px] md:h-[700px] bg-cf-dark overflow-hidden">
        {/* Ambient floating orbs */}
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 bg-cf-tan/40 rounded-full blur-3xl z-[5]"
        />
        <motion.div
          animate={{ y: [0, 40, 0], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-cf-brown/50 rounded-full blur-3xl z-[5]"
        />

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true, bulletActiveClass: 'bg-cf-tan w-8 rounded-full transition-all duration-500', bulletClass: 'swiper-pagination-bullet bg-white/40 opacity-100 w-8 rounded-full transition-all duration-500' }}
          navigation={{
            prevEl: '.hero-swiper-button-prev',
            nextEl: '.hero-swiper-button-next',
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-full w-full"
        >
          {heroBanners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative h-full w-full">
              {/* Dark Overlay Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `linear-gradient(to right, rgba(72, 52, 52, 0.96), rgba(72, 52, 52, 0.55) 55%, rgba(72, 52, 52, 0.35)), url(${banner.image})` }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                <div className="max-w-2xl text-left space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cf-tan/15 border border-cf-tan/30 rounded-full text-xs font-extrabold uppercase tracking-widest text-cf-tan backdrop-blur">
                      <span className="w-1.5 h-1.5 rounded-full bg-cf-tan animate-pulse" />
                      {banner.tag}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
                  >
                    {banner.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg md:text-xl text-cf-cream/85 font-medium leading-relaxed"
                  >
                    {banner.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-wrap gap-4 pt-2"
                  >
                    <Link href={banner.link}>
                      <Button size="lg" className="bg-cf-tan text-cf-dark font-extrabold hover:bg-cf-cream hover:scale-105 transition-all shadow-lg shadow-cf-tan/20 rounded-xl cursor-pointer">
                        {banner.cta}
                      </Button>
                    </Link>
                    <Link href={ROUTES.REGISTER}>
                      <Button size="lg" variant="bordered" className="border-white/50 text-white font-bold hover:bg-white/10 hover:border-white transition-all rounded-xl cursor-pointer">
                        Start a Project
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Slide counter */}
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 z-20 hidden md:flex items-center gap-3 text-cf-cream/80 font-bold">
            <span className="text-2xl text-cf-tan">{String(activeSlide + 1).padStart(2, '0')}</span>
            <span className="text-cf-cream/40 text-xl">/</span>
            <span className="text-cf-cream/40 text-xl">{String(heroBanners.length).padStart(2, '0')}</span>
          </div>

          {/* Custom Arrows */}
          <div className="hero-swiper-button-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl bg-cf-dark/40 border border-cf-cream/25 text-cf-cream flex items-center justify-center cursor-pointer hover:bg-cf-tan hover:text-cf-dark transition-all select-none hidden md:flex shadow-lg backdrop-blur hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </div>
          <div className="hero-swiper-button-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl bg-cf-dark/40 border border-cf-cream/25 text-cf-cream flex items-center justify-center cursor-pointer hover:bg-cf-tan hover:text-cf-dark transition-all select-none hidden md:flex shadow-lg backdrop-blur hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </div>
        </Swiper>

        {/* Stats strip */}
        <div className="absolute bottom-0 inset-x-0 z-10 bg-cf-dark/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { label: 'Credits raised', value: '$12M+' },
              { label: 'Campaigns funded', value: '15K+' },
              { label: 'Active supporters', value: '85K+' },
              { label: 'Global reach', value: '120+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-extrabold text-cf-tan leading-none">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-cf-cream/70 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Top Funded Campaigns Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-cf-brown"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-cf-brown">Backed by Credibility</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-cf-dark">Top Funded Campaigns</h2>
            <p className="text-cf-brown/70 mt-2 text-base max-w-lg">
              Discover the projects that have captured the community&apos;s imagination and raised the maximum credits on CrowdFund.
            </p>
          </div>
          <Link href={ROUTES.CAMPAIGNS}>
            <Button variant="bordered" className="border-cf-brown/40 text-cf-brown hover:bg-cf-brown hover:text-white font-bold rounded-xl cursor-pointer">
              Browse All Campaigns
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/80 border border-cf-brown/10 animate-pulse rounded-2xl h-[420px] overflow-hidden">
                <div className="p-0">
                  <div className="bg-cf-brown/10 h-48 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-cf-brown/10 rounded w-2/3" />
                    <div className="h-4 bg-cf-brown/10 rounded w-1/2" />
                    <div className="space-y-2 pt-4">
                      <div className="h-2 bg-cf-brown/10 rounded w-full" />
                      <div className="h-4 bg-cf-brown/10 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 bg-white/40 border border-dashed border-cf-brown/20 rounded-2xl">
            <p className="text-cf-brown/60 text-lg font-medium">No campaigns found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={campaign._id} campaign={campaign} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Extra Section 1: How It Works */}
      <section className="bg-cf-dark text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cf-brown/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cf-tan/5 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cf-tan">Launch Cycle</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-cf-cream">How CrowdFund Works</h2>
            <p className="text-cf-tan/75 text-sm md:text-base leading-relaxed">
              We provide a transparent, secure ecosystem where launching an idea is simple, backing is intuitive, and creation is fully funded.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Step Selection Accordion */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <motion.div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-cf-brown/30 border-cf-tan/50 shadow-md' 
                        : 'bg-cf-brown/5 border-transparent hover:bg-cf-brown/15'
                    }`}
                    whileHover={{ x: isActive ? 0 : 5 }}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-xl transition-colors ${
                        isActive ? 'bg-cf-tan text-cf-dark' : 'bg-cf-brown/20 text-cf-tan'
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg transition-colors ${
                          isActive ? 'text-cf-tan' : 'text-cf-cream'
                        }`}>
                          {step.title}
                        </h3>
                        {isActive && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-cf-tan/80 text-sm mt-2 leading-relaxed"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Interactive Visual Display of Step */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-md h-[340px] md:h-[400px] bg-cf-brown/10 border border-cf-brown/40 rounded-3xl p-8 flex items-center justify-center shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-cf-brown/20 to-transparent" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="text-center relative z-10 space-y-6 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cf-tan to-white text-cf-dark flex items-center justify-center shadow-lg text-4xl font-extrabold animate-bounce">
                      {activeStep === 0 && '✏️'}
                      {activeStep === 1 && '📢'}
                      {activeStep === 2 && '💳'}
                      {activeStep === 3 && '🚀'}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-extrabold text-cf-cream">{steps[activeStep].title}</h4>
                      <p className="text-cf-tan/80 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                        {steps[activeStep].desc}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {steps.map((s) => (
                        <span 
                          key={s.id} 
                          onClick={() => setActiveStep(s.id)}
                          className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                            activeStep === s.id ? 'bg-cf-tan scale-125' : 'bg-cf-brown/40 hover:bg-cf-tan/50'
                          }`} 
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Explore by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-cf-brown"></span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-cf-brown">Browse by Interest</span>
            <span className="w-6 h-[2px] bg-cf-brown"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-cf-dark">Explore Campaigns</h2>
          <p className="text-cf-brown/70 mt-2 text-base leading-relaxed">
            Find and support campaigns that match your unique passions. From groundbreaking hardware projects to ecological restorations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((cat, idx) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 10px 25px -5px rgba(107, 79, 79, 0.15)' }}
              className="bg-white border border-cf-brown/10 p-8 rounded-2xl flex flex-col justify-between h-64 group relative overflow-hidden transition-all"
            >
              {/* Subtle grid pattern background on card hover */}
              <div className="absolute inset-0 bg-radial-gradient from-cf-tan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 bg-cf-cream rounded-xl flex items-center justify-center text-2xl shadow-sm border border-cf-brown/10">
                  {cat.icon}
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-xl text-cf-dark">{cat.label}</h3>
                    <span className="text-xs font-bold text-cf-brown/65 bg-cf-cream px-2.5 py-0.5 rounded-full border border-cf-brown/5">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-cf-brown/70 text-sm mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 relative z-10">
                <Link href={`${ROUTES.CAMPAIGNS}?category=${cat.value}`} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-cf-brown hover:text-cf-dark transition-colors group/link">
                  Browse category
                  <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Extra Section 3: Platform Impact in Numbers */}
      <section className="bg-cf-tan/30 border-y border-cf-brown/10 py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-6 h-[2px] bg-cf-brown"></span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-cf-brown">By the Numbers</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-cf-dark leading-tight">Platform Impact</h2>
              <p className="text-cf-brown/85 text-base leading-relaxed">
                CrowdFund brings together a global community of innovators, makers, and general supporters. Over the past years, we&apos;ve successfully helped launch thousands of campaigns, empowering independent efforts that change lives.
              </p>
              <div className="flex gap-4 pt-2">
                <Link href={ROUTES.REGISTER}>
                  <Button className="bg-cf-dark text-cf-cream font-bold hover:bg-cf-brown hover:scale-105 transition-all rounded-xl shadow-md cursor-pointer">
                    Join the Community
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Credits Raised', val: '12M+', progress: 85, color: 'bg-cf-brown', desc: 'Securely pooled across campaigns' },
                { label: 'Successful Launches', val: '15K+', progress: 94, color: 'bg-cf-dark', desc: '94% of fully-funded ideas deliver' },
                { label: 'Active Supporters', val: '85K+', progress: 75, color: 'bg-cf-brown', desc: 'Providing support & feedback' },
                { label: 'Global Communities', val: '120+', progress: 60, color: 'bg-cf-dark', desc: 'Participating borders free' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-cf-brown/10 p-6 rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-end">
                    <p className="text-xs uppercase font-bold tracking-wider text-cf-brown/70">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-cf-dark">{stat.val}</p>
                  </div>
                  <div className="w-full bg-cf-cream rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${stat.color}`}
                    />
                  </div>
                  <p className="text-xs text-cf-brown/60 leading-relaxed font-medium">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonial Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-cf-brown"></span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-cf-brown">Backer Stories</span>
            <span className="w-6 h-[2px] bg-cf-brown"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-cf-dark">What Creators Say</h2>
          <p className="text-cf-brown/70 mt-2 text-base leading-relaxed">
            Real stories from creators and supporters who have turned dreams into physical reality on the platform.
          </p>
        </div>

        <div className="relative px-2 md:px-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, bulletActiveClass: 'bg-cf-brown w-6 rounded-full transition-all' }}
            navigation={{
              prevEl: '.testimonial-swiper-button-prev',
              nextEl: '.testimonial-swiper-button-next',
            }}
            className="pb-16"
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="bg-white border border-cf-brown/10 rounded-2xl p-8 flex flex-col justify-between h-full hover:shadow-md transition-all">
                  <div className="p-0 space-y-6">
                    {/* Five Star rating */}
                    <div className="flex gap-1 text-yellow-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-cf-dark font-medium italic text-sm md:text-base leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-cf-brown/10">
                      <img 
                        src={t.photo} 
                        alt={t.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-full object-cover border border-cf-brown/25 shadow-sm"
                      />
                      <div>
                        <h4 className="font-extrabold text-cf-dark text-sm">{t.name}</h4>
                        <p className="text-xs text-cf-brown/70 font-semibold">{t.role}</p>
                        <p className="text-[10px] text-cf-brown/50 mt-0.5">Funded: <span className="font-bold">{t.campaign}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows for Testimonial Slider */}
          <div className="testimonial-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white border border-cf-brown/10 text-cf-brown flex items-center justify-center cursor-pointer hover:bg-cf-brown hover:text-white transition-all select-none hidden md:flex shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </div>
          <div className="testimonial-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white border border-cf-brown/10 text-cf-brown flex items-center justify-center cursor-pointer hover:bg-cf-brown hover:text-white transition-all select-none hidden md:flex shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="bg-cf-brown text-cf-cream py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to Back the Future?</h2>
          <p className="text-cf-cream/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Whether you want to launch a community project or invest in experimental gadgets, we make it secure, fun, and fast.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="bg-cf-cream text-cf-dark font-extrabold hover:bg-white hover:scale-105 transition-all shadow-md rounded-xl cursor-pointer">
                Get Started Today
              </Button>
            </Link>
            <Link href={ROUTES.CAMPAIGNS}>
              <Button size="lg" variant="bordered" className="border-cf-cream/50 text-cf-cream font-bold hover:bg-white/10 hover:border-cf-cream transition-all rounded-xl cursor-pointer">
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
