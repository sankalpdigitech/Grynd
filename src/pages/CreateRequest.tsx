import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { User } from '../types';
import { brutalistCard, brutalistInput, brutalistButtonLight, brutalistButton } from '../lib/theme';

export function CreateRequest({ user }: { user: User | null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillCategory: 'Graphic Design',
    budget: '',
    deadline: '',
    referenceLink: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      return;
    }
    setLoading(true);
    try {
      await api.createRequest(formData);
      navigate('/requests');
    } catch (err) {
      console.error(err);
      alert('Failed to post gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className={`${brutalistCard} p-8 bg-yellow-400`}>
        <h1 className="text-4xl font-display font-bold text-black uppercase mb-8 border-b-4 border-black pb-4 bg-white inline-block px-4 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Post a Gig</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Title
            </label>
            <input
              type="text"
              required
              className={`${brutalistInput} w-full px-4 py-3`}
              placeholder="e.g., Need a poster for college fest"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Skill Category
            </label>
            <select
              className={`${brutalistInput} w-full px-4 py-3 uppercase`}
              value={formData.skillCategory}
              onChange={e => setFormData({ ...formData, skillCategory: e.target.value })}
            >
              <option>Video Editing</option>
              <option>Graphic Design</option>
              <option>Web Development</option>
              <option>Music/Audio</option>
              <option>Tutoring</option>
              <option>Photography</option>
              <option>Event Hosting/Performing</option>
              <option>Writing</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Description
            </label>
            <textarea
              required
              rows={5}
              className={`${brutalistInput} w-full px-4 py-3`}
              placeholder="Describe what you need done in detail..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black uppercase mb-2">
                Budget
              </label>
              <input
                type="text"
                required
                className={`${brutalistInput} w-full px-4 py-3`}
                placeholder="e.g., ₹500 - ₹1000"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black uppercase mb-2">
                Deadline
              </label>
              <input
                type="text"
                required
                className={`${brutalistInput} w-full px-4 py-3`}
                placeholder="e.g., Next Friday"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black uppercase mb-2">
              Reference Link (Optional)
            </label>
            <input
              type="url"
              className={`${brutalistInput} w-full px-4 py-3`}
              placeholder="https://..."
              value={formData.referenceLink}
              onChange={e => setFormData({ ...formData, referenceLink: e.target.value })}
            />
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t-4 border-black mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`${brutalistButtonLight} px-6 py-3 bg-gray-200`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${brutalistButton} px-8 py-3 bg-orange-400 text-black`}
            >
              {loading ? 'POSTING...' : 'POST GIG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
