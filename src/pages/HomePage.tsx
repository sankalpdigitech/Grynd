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
          Delhi's <br/><span className="text-orange-400 bg-black px-2 py-1 sm:px-4 sm:py-2 inline-block -rotate-2 my-2 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] sm:shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] border-3 sm:border-4 border-black">Student</span><br/> Freelance Hub
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
          <p className="text-black font-bold text-lg">Built exclusively for Delhi students. No professional agencies.</p>
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
    </div>
  );
}
