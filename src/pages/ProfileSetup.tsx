import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { User, Profile } from '../types';
import { brutalistCard, brutalistInput, brutalistButton, getCategoryColor } from '../lib/theme';

export function ProfileSetup({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    skills: [] as string[],
    portfolioLinks: [] as string[],
    bio: '',
    availability: '',
    priceRange: ''
  });

  const availableSkills = [
    'Video Editing', 'Graphic Design', 'Web Development', 
    'Music/Audio', 'Tutoring', 'Photography', 
    'Event Hosting/Performing', 'Writing'
  ];

  useEffect(() => {
    if (!user) return;
    api.getProfile(user.id)
      .then(profile => {
        setFormData({
          skills: profile.skills || [],
          portfolioLinks: profile.portfolioLinks || [],
          bio: profile.bio || '',
          availability: profile.availability || '',
          priceRange: profile.priceRange || ''
        });
        setLoading(false);
      })
      .catch(() => {
        // Profile might not exist yet, that's fine
        setLoading(false);
      });
  }, [user]);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(formData);
      alert("Profile updated successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12 font-bold text-xl uppercase">Please login to setup profile.</div>;
  }

  if (loading) {
    return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-yellow-400 mx-auto"></div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className={`${brutalistCard} p-8 bg-purple-400`}>
        <h1 className="text-4xl font-display font-bold text-black uppercase mb-8 border-b-4 border-black pb-4 bg-white inline-block px-4 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Freelancer Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <label className="block text-sm font-bold text-black uppercase mb-3">
              Skills (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 font-bold uppercase border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 ${
                    formData.skills.includes(skill) 
                      ? `${getCategoryColor(skill)}` 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Short Bio
            </label>
            <textarea
              required
              rows={4}
              className={`${brutalistInput} w-full px-4 py-3`}
              placeholder="Tell clients about your experience (e.g., Made 5+ college fest posters...)"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Portfolio Link
            </label>
            <input
              type="url"
              className={`${brutalistInput} w-full px-4 py-3`}
              placeholder="https://instagram.com/yourwork or Behance"
              value={formData.portfolioLinks[0] || ''}
              onChange={e => setFormData({ ...formData, portfolioLinks: e.target.value ? [e.target.value] : [] })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black uppercase mb-2">
                Typical Price Range
              </label>
              <input
                type="text"
                required
                className={`${brutalistInput} w-full px-4 py-3 font-bold`}
                placeholder="e.g., ₹500 - ₹2000 per gig"
                value={formData.priceRange}
                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black uppercase mb-2">
                Availability
              </label>
              <input
                type="text"
                required
                className={`${brutalistInput} w-full px-4 py-3 font-bold uppercase`}
                placeholder="e.g., Weekends only"
                value={formData.availability}
                onChange={e => setFormData({ ...formData, availability: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-8 border-t-4 border-black flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`${brutalistButton} px-8 py-4 bg-orange-400 text-black text-lg`}
            >
              {saving ? 'SAVING...' : 'SAVE PROFILE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
