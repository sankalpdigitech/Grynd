/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { api, setCurrentUser, getCurrentUser } from './lib/api';
import { User } from './types';
import { Search, Briefcase, PlusCircle, User as UserIcon, LayoutDashboard, CheckCircle2, ChevronRight, LogOut, CheckSquare, Menu, X } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { CreateRequest } from './pages/CreateRequest';
import { BrowseRequests } from './pages/BrowseRequests';
import { RequestDetails } from './pages/RequestDetails';
import { FreelancerDirectory } from './pages/FreelancerDirectory';
import { ProfileSetup } from './pages/ProfileSetup';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import logo from './Grynd.png';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Navigation({ user, onLogout }: { user: User | null, onLogout: () => void }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showFindWork = !user || user.role === 'FREELANCER' || user.role === 'BOTH';
  const showHireTalent = !user || user.role === 'CLIENT' || user.role === 'BOTH';
  const canPostGig = user && (user.role === 'CLIENT' || user.role === 'BOTH');
  
  return (
    <nav className="sticky top-0 z-50 bg-[#f4f4f0] border-b-4 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white border-3 border-black rounded-lg flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[1px] group-hover:translate-x-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
            <img src={logo} alt="Grynd Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-2xl tracking-tighter text-black uppercase mt-1">
            Grynd
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            {showFindWork && (
              <Link to="/requests" className={cn(
                "px-4 py-2 font-bold uppercase tracking-wider text-sm border-2 border-black rounded-lg transition-all",
                location.pathname === '/requests' 
                  ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200"
              )}>
                Find Work
              </Link>
            )}
            {showHireTalent && (
              <Link to="/freelancers" className={cn(
                "px-4 py-2 font-bold uppercase tracking-wider text-sm border-2 border-black rounded-lg transition-all",
                location.pathname === '/freelancers'
                  ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200"
              )}>
                Hire Talent
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4 border-l-2 border-gray-300 pl-6">
            {!user ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setCurrentUser('u1');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-blue-400 border-2 border-black rounded-lg text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300 transition-colors"
                >
                  Login (Client)
                </button>
                <button 
                  onClick={() => {
                    setCurrentUser('u2');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-green-400 border-2 border-black rounded-lg text-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-300 transition-colors"
                >
                  Login (Freelancer)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {canPostGig && (
                  <Link to="/create-request" className="inline-flex items-center justify-center bg-orange-400 border-3 border-black rounded-lg px-4 py-2 text-sm font-bold text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <PlusCircle className="w-4 h-4 mr-2 stroke-[3]" />
                    Post a Gig
                  </Link>
                )}
                <Link to="/dashboard" className="w-10 h-10 bg-white border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <span className="sr-only">Dashboard</span>
                  <UserIcon className="w-5 h-5 text-black stroke-[3]" />
                </Link>
                <button onClick={onLogout} className="w-10 h-10 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" title="Logout">
                  <LogOut className="w-5 h-5 text-black stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border-3 border-black rounded-lg bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative w-11 h-11 flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6 stroke-[3]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden flex flex-col gap-4"
          >
            <div className="mt-4 pt-4 border-t-2 border-black flex flex-col gap-4 pb-2">
              {showFindWork && (
                <Link 
                  to="/requests" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 font-bold uppercase tracking-wider text-sm border-2 border-black rounded-lg bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200 transition-colors"
                >
                  Find Work
                </Link>
              )}
              {showHireTalent && (
                <Link 
                  to="/freelancers" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 font-bold uppercase tracking-wider text-sm border-2 border-black rounded-lg bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200 transition-colors"
                >
                  Hire Talent
                </Link>
              )}
              
              <div className="h-px bg-black my-2" />
              
              {!user ? (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setCurrentUser('u1');
                      window.location.reload();
                    }}
                    className="w-full px-4 py-3 bg-blue-400 border-2 border-black rounded-lg text-black font-bold uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Login (Client)
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentUser('u2');
                      window.location.reload();
                    }}
                    className="w-full px-4 py-3 bg-green-400 border-2 border-black rounded-lg text-black font-bold uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Login (Freelancer)
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {canPostGig && (
                    <Link 
                      to="/create-request" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center bg-orange-400 border-3 border-black rounded-lg px-4 py-3 text-sm font-bold text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <PlusCircle className="w-5 h-5 mr-2 stroke-[3]" />
                      Post a Gig
                    </Link>
                  )}
                  <div className="flex gap-3">
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 bg-white border-3 border-black rounded-lg flex items-center justify-center py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <UserIcon className="w-5 h-5 text-black stroke-[3] mr-2" />
                      <span className="font-bold uppercase text-sm text-black">Dashboard</span>
                    </Link>
                    <button 
                      onClick={onLogout} 
                      className="px-6 bg-red-400 border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-black stroke-[3]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        <MainContent user={user} />
      </div>
    </HashRouter>
  );
}

function MainContent({ user }: { user: User | null }) {
  const location = useLocation();
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div key="/" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><HomePage user={user} /></motion.div>} />
          <Route path="/dashboard" element={<motion.div key="/dashboard" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><Dashboard user={user} /></motion.div>} />
          <Route path="/create-request" element={<motion.div key="/create-request" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><CreateRequest user={user} /></motion.div>} />
          <Route path="/requests" element={<motion.div key="/requests" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><BrowseRequests /></motion.div>} />
          <Route path="/requests/:id" element={<motion.div key="request-details" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><RequestDetails user={user} /></motion.div>} />
          <Route path="/freelancers" element={<motion.div key="/freelancers" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><FreelancerDirectory /></motion.div>} />
          <Route path="/profile-setup" element={<motion.div key="/profile-setup" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.2}}><ProfileSetup user={user} /></motion.div>} />
        </Routes>
      </AnimatePresence>
    </main>
  );
}
