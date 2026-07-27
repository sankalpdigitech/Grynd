import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Profile, User } from '../types';
import { Search, MapPin, IndianRupee, Link as LinkIcon, Briefcase } from 'lucide-react';
import { brutalistCard, brutalistInput, brutalistBadge, getCategoryColor } from '../lib/theme';

export function FreelancerDirectory() {
  const [profiles, setProfiles] = useState<(Profile & { user?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    api.getProfiles().then(data => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.user?.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.bio.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.skills.includes(categoryFilter) : true;
    return matchesSearch && matchesCategory;
  });

  const allSkills = Array.from(new Set(profiles.flatMap(p => p.skills))) as string[];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black uppercase">Student Talent</h1>
          <p className="text-black font-bold text-lg mt-2 bg-yellow-300 inline-block px-2 border-2 border-black -rotate-1">Hire verified students for your next project.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 bg-white p-6 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-black stroke-[3]" />
          </div>
          <input
            type="text"
            className={`${brutalistInput} block w-full pl-12 pr-3 py-3 text-lg font-bold`}
            placeholder="SEARCH FREELANCERS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`${brutalistInput} block w-full md:w-64 px-4 py-3 text-lg font-bold uppercase`}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">ALL SKILLS</option>
          {allSkills.map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-yellow-400 mx-auto"></div>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-12 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-black font-bold text-xl uppercase">No freelancers found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map(profile => (
            <div key={profile.id} className={`${brutalistCard} p-0 flex flex-col h-full bg-white`}>
              <div className="px-5 py-4 border-b-3 border-black flex items-center space-x-4">
                <div className="w-14 h-14 bg-white border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-display font-bold text-2xl -rotate-6">
                  {profile.user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-black uppercase tracking-tight">{profile.user?.name}</h3>
                  <div className="flex items-center text-sm font-bold text-black">
                    <MapPin className="w-4 h-4 mr-1 stroke-[3]" />
                    {profile.user?.school}
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map(skill => (
                    <span key={skill} className={`${getCategoryColor(skill)} ${brutalistBadge}`}>
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-black font-medium mb-4 flex-grow">
                  "{profile.bio}"
                </p>
                
                <div className="pt-4 border-t-3 border-black flex flex-col gap-3 mt-auto text-sm font-bold uppercase">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <IndianRupee className="w-5 h-5 mr-1 stroke-[3]" />
                      STARTING AT
                    </span>
                    <span className="bg-yellow-300 px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                      {profile.priceRange}
                    </span>
                  </div>
                  {profile.portfolioLinks.length > 0 && (
                    <a href={profile.portfolioLinks[0]} target="_blank" rel="noreferrer" className="flex items-center text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors px-2 py-1 -ml-2 w-max">
                      <LinkIcon className="w-4 h-4 mr-2 stroke-[3]" />
                      VIEW PORTFOLIO
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
