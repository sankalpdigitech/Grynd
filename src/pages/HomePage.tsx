import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { ArrowRight, Search, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { brutalistCard, brutalistButton, brutalistButtonLight } from '../lib/theme';

export function HomePage({ user }: { user: User | null }) {
  const showFindWork = !user || user.role === 'FREELANCER' || user.role === 'BOTH';
  const showHireTalent = !user || user.role === 'CLIENT' || user.role === 'BOTH';

  return (
    <div className="flex flex-col space-y-16 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative">
        <div className="absolute top-0 left-4 w-12 h-12 bg-blue-400 border-3 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-12 hidden md:block" />
        <div className="absolute bottom-0 right-4 w-16 h-16 bg-yellow-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden md:block" />
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter text-black uppercase mb-6 leading-none">
          Your <span className="text-orange-400 bg-black px-2 py-1 sm:px-4 sm:py-2 inline-block -rotate-2 my-2 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] sm:shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] border-3 sm:border-4 border-black">Skill.</span><br/> Your <span className="text-[#5C46E8]">G</span><span className="text-[#19B8AF]">r</span><span className="text-[#F8B11A]">y</span><span className="text-[#5C46E8]">n</span><span className="text-[#19B8AF]">d</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-black font-bold mb-10 max-w-2xl mx-auto border-y-4 border-black py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Need a fest poster? A reel edited? A tutor? Find verified student talent.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {showFindWork && (
            <Link to="/requests" className={`${brutalistButton} px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg inline-flex items-center justify-center`}>
              Find Work <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </Link>
          )}
          {showHireTalent && (
            <Link to="/freelancers" className={`${brutalistButtonLight} px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg inline-flex items-center justify-center`}>
              Hire a Student
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <div className={`${brutalistCard} p-8 text-center bg-green-400`}>
          <div className="w-16 h-16 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-6 rotate-3">
            <GraduationCap className="w-8 h-8 text-black stroke-[3]" />
          </div>
          <h3 className="text-2xl font-display uppercase tracking-tight mb-4">Student Only</h3>
          <p className="text-black font-bold text-lg">Built exclusively for students. No professional agencies.</p>
        </div>
        
        <div className={`${brutalistCard} p-8 text-center bg-blue-400`}>
          <div className="w-16 h-16 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-6 -rotate-3">
            <Briefcase className="w-8 h-8 text-black stroke-[3]" />
          </div>
          <h3 className="text-2xl font-display uppercase tracking-tight mb-4">Student Budgets</h3>
          <p className="text-black font-bold text-lg">Fair pricing meant for pocket-money, not global professional rates.</p>
        </div>
        
        <div className={`${brutalistCard} p-8 text-center bg-fuchsia-400`}>
          <div className="w-16 h-16 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-6 rotate-6">
            <ShieldCheck className="w-8 h-8 text-black stroke-[3]" />
          </div>
          <h3 className="text-2xl font-display uppercase tracking-tight mb-4">Verified Trust</h3>
          <p className="text-black font-bold text-lg">Every user is verified to be a real student. No strangers.</p>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="pt-16 pb-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-black uppercase mb-12 text-center">How Grynd Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${brutalistCard} p-6 bg-yellow-400 relative mt-4 md:mt-0`}>
            <div className="absolute -top-5 -left-4 w-12 h-12 bg-black text-white font-display text-2xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full">1</div>
            <h3 className="text-xl font-display font-bold uppercase mb-2 mt-2">Post a Gig</h3>
            <p className="font-bold text-base">Clients post what they need done, their budget, and deadline.</p>
          </div>
          <div className={`${brutalistCard} p-6 bg-orange-400 relative mt-4 md:mt-0`}>
            <div className="absolute -top-5 -left-4 w-12 h-12 bg-black text-white font-display text-2xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full">2</div>
            <h3 className="text-xl font-display font-bold uppercase mb-2 mt-2">Students Pitch</h3>
            <p className="font-bold text-base">Freelancers review gigs and pitch their rates and approach.</p>
          </div>
          <div className={`${brutalistCard} p-6 bg-cyan-400 relative mt-4 md:mt-0`}>
            <div className="absolute -top-5 -left-4 w-12 h-12 bg-black text-white font-display text-2xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full">3</div>
            <h3 className="text-xl font-display font-bold uppercase mb-2 mt-2">Collaborate</h3>
            <p className="font-bold text-base">Client selects the best pitch and the work begins.</p>
          </div>
          <div className={`${brutalistCard} p-6 bg-green-400 relative mt-4 md:mt-0`}>
            <div className="absolute -top-5 -left-4 w-12 h-12 bg-black text-white font-display text-2xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full">4</div>
            <h3 className="text-xl font-display font-bold uppercase mb-2 mt-2">Get Paid</h3>
            <p className="font-bold text-base">Work is delivered, client approves, and the student gets paid.</p>
          </div>
        </div>
      </div>

      {/* The Idea Behind It */}
      <div className={`${brutalistCard} p-8 md:p-12 bg-white mt-8 mb-12`}>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-black uppercase mb-6 inline-block border-b-4 border-black pb-2">The Idea Behind Grynd</h2>
            <p className="text-lg md:text-xl font-bold mb-4">
              Students have incredible skills—designing, coding, editing, tutoring—but traditional freelance platforms are saturated with professionals and agencies. 
            </p>
            <p className="text-lg md:text-xl font-bold">
              Grynd was built to create a closed, trusted ecosystem just for students. We want to empower you to build a portfolio, earn money, and collaborate with your peers, all without competing against global agencies.
            </p>
          </div>
          <div className="lg:w-1/2 bg-yellow-300 border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl md:-rotate-1 hover:rotate-0 transition-transform duration-300">
             <h2 className="text-2xl md:text-4xl font-display font-bold text-black uppercase mb-6">Message from the Founder</h2>
             <div className="bg-white border-2 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
               <p className="text-base md:text-lg font-bold italic leading-relaxed">
                 "I started Grynd because I saw so many talented friends struggling to find freelance work that fit their schedule and respected their student status. We are building more than a platform; we are building a community where your skills are valued, and your hustle is celebrated."
               </p>
             </div>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-display text-xl">SG</div>
               <div>
                 <p className="text-xl font-display font-bold uppercase">Shwaans Gaba</p>
                 <p className="text-sm font-bold uppercase text-gray-700">Founder, Grynd</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
