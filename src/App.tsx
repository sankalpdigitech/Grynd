/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { api, setCurrentUser, getCurrentUser } from './lib/api';
import { User } from './types';
import { Search, Briefcase, PlusCircle, User as UserIcon, LayoutDashboard, CheckCircle2, ChevronRight, LogOut, CheckSquare } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { CreateRequest } from './pages/CreateRequest';
import { BrowseRequests } from './pages/BrowseRequests';
import { RequestDetails } from './pages/RequestDetails';
import { FreelancerDirectory } from './pages/FreelancerDirectory';
import { ProfileSetup } from './pages/ProfileSetup';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Navigation({ user, onLogout }: { user: User | null, onLogout: () => void }) {
  const location = useLocation();
  const showFindWork = !user || user.role === 'FREELANCER' || user.role === 'BOTH';
  const showHireTalent = !user || user.role === 'CLIENT' || user.role === 'BOTH';
  const canPostGig = user && (user.role === 'CLIENT' || user.role === 'BOTH');
  
  return (
    <nav className="sticky top-0 z-50 bg-[#f4f4f0] border-b-4 border-black px-2 sm:px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 border-3 border-black flex items-center justify-center text-black font-display text-lg sm:text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[1px] group-hover:translate-x-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              DS
            </div>
            <span className="font-display text-xl sm:text-2xl tracking-tighter text-black uppercase mt-1">
              DelhiSkill
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:ml-8">
            {showFindWork && (
              <Link to="/requests" className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 font-bold uppercase tracking-wider text-xs sm:text-sm border-2 border-black transition-all",
                location.pathname === '/requests' 
                  ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200"
              )}>
                Find Work
              </Link>
            )}
            {showHireTalent && (
              <Link to="/freelancers" className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 font-bold uppercase tracking-wider text-xs sm:text-sm border-2 border-black transition-all",
                location.pathname === '/freelancers'
                  ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200"
              )}>
                Hire Talent
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-4">
          {!user ? (
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => {
                  setCurrentUser('u1');
                  window.location.reload();
                }}
                className="px-3 py-1.5 bg-blue-400 border-2 border-black text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300 transition-colors"
              >
                Login (Client)
              </button>
              <button 
                onClick={() => {
                  setCurrentUser('u2');
                  window.location.reload();
                }}
                className="px-3 py-1.5 bg-green-400 border-2 border-black text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-300 transition-colors"
              >
                Login (Freelancer)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {canPostGig && (
                <Link to="/create-request" className="inline-flex items-center justify-center bg-orange-400 border-3 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 stroke-[3]" />
                  Post <span className="hidden sm:inline ml-1">a Gig</span>
                </Link>
              )}
              <Link to="/dashboard" className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <span className="sr-only">Dashboard</span>
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" />
              </Link>
              <button onClick={onLogout} className="w-8 h-8 sm:w-10 sm:h-10 bg-red-400 border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" title="Logout">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is "logged in"
    const currentId = getCurrentUser();
    if (currentId) {
      api.getMe().then(u => {
        setUser(u);
        setLoading(false);
      }).catch(() => {
        setCurrentUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    window.location.hash = '#/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/create-request" element={<CreateRequest user={user} />} />
            <Route path="/requests" element={<BrowseRequests />} />
            <Route path="/requests/:id" element={<RequestDetails user={user} />} />
            <Route path="/freelancers" element={<FreelancerDirectory />} />
            <Route path="/profile-setup" element={<ProfileSetup user={user} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
