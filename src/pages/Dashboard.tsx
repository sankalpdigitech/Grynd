import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { User, RequestPost, Pitch } from '../types';
import { brutalistCard, brutalistButton, brutalistBadge } from '../lib/theme';

export function Dashboard({ user }: { user: User | null }) {
  const [myRequests, setMyRequests] = useState<RequestPost[]>([]);
  const [myPitches, setMyPitches] = useState<(Pitch & { request?: RequestPost })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    Promise.all([
      api.getRequests(),
      // In a real app we'd have a specific endpoint for user's pitches
      // For MVP, we'll fetch all requests and then pitches for those to find user's pitches
    ]).then(async ([reqs]) => {
      setMyRequests(reqs.filter(r => r.clientId === user.id));
      
      // Simulate fetching my pitches (inefficient for prod, fine for mocked MVP)
      const pitchesPromises = reqs.map(r => api.getPitches(r.id).then(pts => pts.map(p => ({ ...p, request: r }))));
      const allPitchesNested = await Promise.all(pitchesPromises);
      const allPitches = allPitchesNested.flat();
      setMyPitches(allPitches.filter(p => p.freelancerId === user.id));
      
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return <div className="text-center py-12 font-bold text-xl uppercase">Please login to view dashboard.</div>;
  }

  if (loading) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-yellow-400 mx-auto"></div></div>;
  }

  const isClient = user.role === 'CLIENT' || user.role === 'BOTH';
  const isFreelancer = user.role === 'FREELANCER' || user.role === 'BOTH';

  return (
    <div className="space-y-12">
      <div className="border-b-4 border-black pb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-black uppercase mb-4">Welcome, {user.name}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold uppercase text-sm">Status:</span>
          <span className="bg-green-400 border-2 border-black px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-black uppercase -rotate-2 rounded-md">
            {user.status}
          </span>
          {isFreelancer && (
            <Link to="/profile-setup" className="ml-0 sm:ml-4 font-bold uppercase text-black hover:bg-yellow-300 border-2 border-transparent hover:border-black transition-colors px-2 py-1 rounded-md">
              Edit Freelancer Profile ➔
            </Link>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isClient && isFreelancer ? 'lg:grid-cols-2' : ''} gap-8`}>
        {/* Client View */}
        {isClient && (
          <div className={`${brutalistCard} p-6 bg-[#dbeafe]`}>
            <div className="flex justify-between items-center mb-6 border-b-3 border-black pb-4">
              <h2 className="text-2xl font-display font-bold text-black uppercase">My Posted Gigs</h2>
              <Link to="/create-request" className="text-sm font-bold uppercase text-black hover:bg-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors">
                Post New Gig
              </Link>
            </div>
            
            {myRequests.length === 0 ? (
              <div className="bg-white border-3 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase rounded-lg">
                You haven't posted any gigs yet.
              </div>
            ) : (
              <div className="space-y-6">
                {myRequests.map(req => (
                  <Link key={req.id} to={`/requests/${req.id}`} className="block bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-black uppercase line-clamp-1">{req.title}</h3>
                      <span className="bg-yellow-300 border-2 border-black px-2 font-bold text-black text-xs uppercase -rotate-3 rounded-md">
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-black mb-3">{req.skillCategory}</div>
                    <div className="text-sm text-black font-medium line-clamp-2">{req.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Freelancer View */}
        {isFreelancer && (
          <div className={`${brutalistCard} p-6 bg-[#fce7f3]`}>
            <div className="flex justify-between items-center mb-6 border-b-3 border-black pb-4">
              <h2 className="text-2xl font-display font-bold text-black uppercase">My Pitches</h2>
              <Link to="/requests" className="text-sm font-bold uppercase text-black hover:bg-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors rounded-md">
                Find More Gigs
              </Link>
            </div>
            
            {myPitches.length === 0 ? (
              <div className="bg-white border-3 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase rounded-lg">
                You haven't pitched for any gigs yet.
              </div>
            ) : (
              <div className="space-y-6">
                {myPitches.map(pitch => (
                  <Link key={pitch.id} to={`/requests/${pitch.requestId}`} className="block bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-black uppercase line-clamp-1 text-sm flex-1 mr-2">FOR: {pitch.request?.title}</h3>
                      <span className="font-display font-bold text-black border-2 border-black px-1 bg-green-400 text-sm whitespace-nowrap rounded-md">
                        {pitch.proposedPrice}
                      </span>
                    </div>
                    <div className="text-sm text-black font-medium mb-3 italic">"{pitch.message}"</div>
                    <div className="text-xs font-bold uppercase text-black flex justify-between border-t-2 border-black pt-2">
                      <span>Timeline: {pitch.timeline}</span>
                      <span>Status: {pitch.request?.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
