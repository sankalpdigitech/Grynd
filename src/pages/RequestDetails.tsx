import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { RequestPost, Pitch, User } from '../types';
import { MapPin, Clock, IndianRupee, Link as LinkIcon, User as UserIcon } from 'lucide-react';
import { brutalistCard, brutalistButton, brutalistInput, getCategoryColor, brutalistBadge } from '../lib/theme';

export function RequestDetails({ user }: { user: User | null }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestPost & { client?: User } | null>(null);
  const [pitches, setPitches] = useState<(Pitch & { freelancer?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  // Pitch form state
  const [pitchMessage, setPitchMessage] = useState('');
  const [pitchPrice, setPitchPrice] = useState('');
  const [pitchTimeline, setPitchTimeline] = useState('');
  const [submittingPitch, setSubmittingPitch] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      api.getRequests().then(reqs => reqs.find(r => r.id === id)),
      api.getPitches(id)
    ]).then(([req, pts]) => {
      setRequest(req || null);
      setPitches(pts);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setSubmittingPitch(true);
    try {
      const newPitch = await api.createPitch(id, {
        message: pitchMessage,
        proposedPrice: pitchPrice,
        timeline: pitchTimeline
      });
      // Refresh pitches
      const updatedPitches = await api.getPitches(id);
      setPitches(updatedPitches);
      
      setPitchMessage('');
      setPitchPrice('');
      setPitchTimeline('');
      alert('Pitch submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit pitch');
    } finally {
      setSubmittingPitch(false);
    }
  };

  const handleSelectFreelancer = async (freelancerId: string) => {
    if (!id || !user) return;
    if (confirm("Select this freelancer? Their contact info will be revealed and the gig will move to In Progress.")) {
      try {
        await api.updateRequest(id, {
          selectedFreelancerId: freelancerId,
          status: 'IN_PROGRESS'
        });
        // Refresh request
        const reqs = await api.getRequests();
        setRequest(reqs.find(r => r.id === id) || null);
      } catch (err) {
        alert("Failed to select freelancer");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-yellow-400 mx-auto"></div></div>;
  }

  if (!request) {
    return <div className="text-center py-12 font-bold text-xl uppercase">Gig not found.</div>;
  }

  const isClient = user?.id === request.clientId;
  const hasPitched = pitches.some(p => p.freelancerId === user?.id);
  const selectedFreelancer = request.selectedFreelancerId 
    ? pitches.find(p => p.freelancerId === request.selectedFreelancerId)?.freelancer 
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className={`${brutalistCard} p-0 bg-white`}>
        <div className={`px-8 py-6 border-b-4 border-black ${getCategoryColor(request.skillCategory)}`}>
          <span className="font-bold uppercase tracking-wider text-sm bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block mb-4 -rotate-2">
            {request.skillCategory}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black uppercase mb-4 leading-none">{request.title}</h1>
          
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center text-black font-bold bg-white/50 px-3 py-1 border-2 border-black">
              <UserIcon className="w-5 h-5 mr-2 stroke-[3]" />
              {request.client?.name}
            </div>
            <div className="flex items-center text-black font-bold bg-white/50 px-3 py-1 border-2 border-black">
              <MapPin className="w-5 h-5 mr-2 stroke-[3]" />
              {request.client?.school}
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-white">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-yellow-300 border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              <div className="text-sm font-bold uppercase mb-1">Budget Range</div>
              <div className="text-3xl font-display font-bold text-black">{request.budget}</div>
            </div>
            
            <div className="bg-gray-100 border-3 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Status: {request.status}
            </div>
          </div>
          
          <div className="prose max-w-none text-black font-medium mb-12 text-lg whitespace-pre-line border-l-4 border-black pl-6">
            {request.description}
          </div>
          
          <div className="grid grid-cols-2 gap-6 py-6 border-y-4 border-black mb-8 bg-gray-50 -mx-8 px-8">
            <div>
              <div className="text-sm font-bold uppercase text-black mb-2">Deadline</div>
              <div className="font-bold text-lg flex items-center bg-white border-2 border-black px-3 py-2 w-max shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="w-5 h-5 mr-2 stroke-[3]" />
                {request.deadline}
              </div>
            </div>
            {request.referenceLink && (
              <div>
                <div className="text-sm font-bold uppercase text-black mb-2">Reference</div>
                <a href={request.referenceLink} target="_blank" rel="noreferrer" className="text-black font-bold flex items-center bg-white border-2 border-black px-3 py-2 w-max shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-colors">
                  <LinkIcon className="w-5 h-5 mr-2 stroke-[3]" />
                  VIEW LINK
                </a>
              </div>
            )}
          </div>

          {/* Selected Freelancer Info (Visible to both when selected) */}
          {request.status !== 'OPEN' && selectedFreelancer && (
            <div className="bg-green-300 border-4 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-display font-bold text-black uppercase mb-4 bg-white inline-block px-3 py-1 border-2 border-black -rotate-1">Gig is In Progress</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="bg-white border-2 border-black p-4 w-full md:w-auto flex-grow">
                  <p className="text-black font-bold text-lg mb-2">Freelancer: {selectedFreelancer.name}</p>
                  {(isClient || user?.id === selectedFreelancer.id) ? (
                    <p className="text-black font-medium border-t-2 border-black pt-2 mt-2">
                      Contact: {selectedFreelancer.phone} / {selectedFreelancer.email}
                    </p>
                  ) : (
                    <p className="text-black font-medium italic border-t-2 border-black pt-2 mt-2">Contact info hidden</p>
                  )}
                </div>
                {isClient && request.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => api.updateRequest(request.id, { status: 'COMPLETED' }).then(() => window.location.reload())}
                    className={`${brutalistButton} px-6 py-3 whitespace-nowrap`}
                  >
                    MARK COMPLETED
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Section */}
          {request.status === 'OPEN' && (
            <div className="mt-12">
              {isClient ? (
                <div>
                  <h3 className="text-3xl font-display font-bold text-black uppercase mb-8 border-b-4 border-black pb-4">Pitches ({pitches.length})</h3>
                  {pitches.length === 0 ? (
                    <p className="text-black font-bold text-lg uppercase bg-yellow-200 border-3 border-black p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">No pitches yet. Wait for freelancers to respond.</p>
                  ) : (
                    <div className="space-y-8">
                      {pitches.map((pitch, idx) => (
                        <div key={pitch.id} className="bg-blue-100 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
                          <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border-3 border-black font-display font-bold flex items-center justify-center rotate-12">
                            {idx + 1}
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b-3 border-black pb-4">
                            <div>
                              <div className="font-display font-bold text-2xl text-black uppercase mb-1">{pitch.freelancer?.name}</div>
                              <div className="text-sm font-bold text-black uppercase bg-white px-2 py-1 border-2 border-black inline-block">{pitch.freelancer?.school}</div>
                            </div>
                            <div className="text-left md:text-right">
                              <div className="font-display font-bold text-3xl text-black bg-yellow-300 px-3 border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2 mb-2 inline-block">
                                {pitch.proposedPrice}
                              </div>
                              <div className="text-sm font-bold uppercase text-black">Timeline: {pitch.timeline}</div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <p className="text-sm font-bold uppercase mb-2">Message:</p>
                            <p className="text-black font-medium bg-white p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              "{pitch.message}"
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => handleSelectFreelancer(pitch.freelancerId)}
                            className={`${brutalistButton} w-full py-4 text-lg`}
                          >
                            SELECT & REVEAL CONTACT INFO
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : user && (user.role === 'FREELANCER' || user.role === 'BOTH') && !hasPitched ? (
                <div className="bg-orange-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-3xl font-display font-bold text-black uppercase mb-6 bg-white inline-block px-4 py-2 border-3 border-black -rotate-1">Pitch for this gig</h3>
                  <form onSubmit={handlePitchSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold uppercase text-black mb-2">Message</label>
                      <textarea 
                        required
                        className={`${brutalistInput} w-full px-4 py-3`}
                        rows={4}
                        placeholder="Why are you a good fit?"
                        value={pitchMessage}
                        onChange={e => setPitchMessage(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold uppercase text-black mb-2">Your Price</label>
                        <input 
                          required
                          type="text"
                          className={`${brutalistInput} w-full px-4 py-3 font-bold`}
                          placeholder="e.g., ₹800"
                          value={pitchPrice}
                          onChange={e => setPitchPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase text-black mb-2">Timeline</label>
                        <input 
                          required
                          type="text"
                          className={`${brutalistInput} w-full px-4 py-3 font-bold`}
                          placeholder="e.g., 3 days"
                          value={pitchTimeline}
                          onChange={e => setPitchTimeline(e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={submittingPitch}
                      className={`${brutalistButton} w-full py-4 text-lg bg-black text-white mt-4`}
                    >
                      {submittingPitch ? 'SUBMITTING...' : 'SUBMIT PITCH'}
                    </button>
                  </form>
                </div>
              ) : user && hasPitched ? (
                <div className="bg-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                  <h3 className="text-2xl font-display font-bold text-black uppercase mb-4">You have pitched for this gig!</h3>
                  <p className="text-black font-bold text-lg bg-white inline-block px-4 py-2 border-2 border-black">The client is reviewing pitches. If selected, your contact info will be shared with them.</p>
                </div>
              ) : (
                <div className="bg-gray-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                  <p className="text-black font-bold text-xl uppercase">
                    {!user ? "Please login as a freelancer to pitch for this gig." : "Only freelancer accounts can pitch for gigs."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
