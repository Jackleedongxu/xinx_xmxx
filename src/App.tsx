import React from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { ContrastSection } from './components/ContrastSection';
import { IouSection } from './components/IouSection';
import { TimelineSection } from './components/TimelineSection';
import { DictionarySection } from './components/DictionarySection';
import { LockedBoxSection } from './components/LockedBoxSection';
import { EndingSection } from './components/EndingSection';

export default function App() {
  const handleStart = () => {
    const el = document.getElementById('contrasts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A3B43] relative selection:bg-pink-200 selection:text-pink-900">
      {/* Soft romantic ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/30 via-rose-100/20 to-transparent rounded-full blur-3xl animate-soft-pulse" />
        <div className="absolute top-1/3 left-[-100px] w-[450px] h-[450px] bg-gradient-to-tr from-pink-100/35 via-rose-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-[-100px] w-[550px] h-[550px] bg-gradient-to-tl from-pink-200/35 via-rose-100/25 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating Header */}
      <HeaderNav />

      {/* Main Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Module 0: Cover */}
        <HeroSection onStart={handleStart} />

        {/* Subtle section divider */}
        <div className="max-w-md mx-auto w-full px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        </div>

        {/* Module 1: Dual Contrast */}
        <ContrastSection />

        <div className="max-w-md mx-auto w-full px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        </div>

        {/* Module 2: 4 IOUs & Realities */}
        <IouSection />

        <div className="max-w-md mx-auto w-full px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        </div>

        {/* Module 3: Timeline of Objects */}
        <TimelineSection />

        <div className="max-w-md mx-auto w-full px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        </div>

        {/* Module 4: Our Dictionary */}
        <DictionarySection />

        <div className="max-w-md mx-auto w-full px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        </div>

        {/* Module 5: Locked Box */}
        <LockedBoxSection />

        {/* Module 6: Ending */}
        <EndingSection />
      </main>
    </div>
  );
}
