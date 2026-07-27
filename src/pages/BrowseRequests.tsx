import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { RequestPost, User } from '../types';
import { Search, MapPin, Clock, IndianRupee } from 'lucide-react';
import { brutalistCard, brutalistInput, getCategoryColor, brutalistBadge } from '../lib/theme';

export function BrowseRequests() {
  const [requests, setRequests] = useState<(RequestPost & { client?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    api.getRequests().then(data => {
      setRequests(data.filter(r => r.status === 'OPEN'));
      setLoading(false);
    });
  }, []);

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? r.skillCategory === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(requests.map(r => r.skillCategory))) as string[];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black uppercase">Open Gigs</h1>
          <p className="text-black font-bold text-lg mt-2 bg-yellow-300 inline-block px-2 border-2 border-black -rotate-1">Find tasks posted by other students.</p>
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
            placeholder="SEARCH GIGS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`${brutalistInput} block w-full md:w-64 px-4 py-3 text-lg font-bold uppercase`}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">ALL CATEGORIES</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-yellow-400 mx-auto"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-black font-bold text-xl uppercase">No gigs found.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <Link key={request.id} to={`/requests/${request.id}`} className="block group">
              <div className={`${brutalistCard} p-0 h-full flex flex-col hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white`}>
                <div className={`px-4 py-3 border-b-3 border-black flex justify-between items-center ${getCategoryColor(request.skillCategory)}`}>
                  <span className="font-bold uppercase tracking-wider text-sm truncate pr-2">
                    {request.skillCategory}
                  </span>
                  <span className="text-sm font-bold bg-white px-2 py-1 border-2 border-black flex items-center whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                    {request.budget}
                  </span>
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-display uppercase tracking-tight text-black mb-3 line-clamp-2">
                    {request.title}
                  </h3>
                  
                  <p className="text-black font-medium mb-4 line-clamp-3 flex-grow">
                    {request.description}
                  </p>
                  
                  <div className="pt-4 border-t-3 border-black flex items-center justify-between font-bold text-sm mt-auto uppercase">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-1 stroke-[3]" />
                      <span className="truncate max-w-[120px]">{request.client?.school || 'Delhi'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-1 stroke-[3]" />
                      <span className="truncate max-w-[100px]">{request.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
