'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import { User, Save, Loader2, X, Plus } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim().toLowerCase();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save - in production this would call the API
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Edit Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Keep your profile up to date for better match scores.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6 space-y-6"
      >
        {/* User info header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[rgb(var(--border))]">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-lg gradient-primary text-white mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1.5">Bio</label>
          <textarea
            id="bio"
            rows={4}
            className="input-field resize-none"
            placeholder="Tell clients about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">Location</label>
          <input
            id="location"
            type="text"
            className="input-field"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Hourly Rate (Freelancer) */}
        {user?.role === 'FREELANCER' && (
          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium mb-1.5">Hourly Rate (USD)</label>
            <input
              id="hourlyRate"
              type="number"
              className="input-field"
              placeholder="e.g. 75"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
        )}

        {/* Skills */}
        {user?.role === 'FREELANCER' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button onClick={addSkill} className="btn-secondary py-3 px-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GitHub */}
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium mb-1.5">GitHub URL</label>
          <input
            id="githubUrl"
            type="url"
            className="input-field"
            placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>

        {/* Portfolio */}
        <div>
          <label htmlFor="portfolioUrl" className="block text-sm font-medium mb-1.5">Portfolio URL</label>
          <input
            id="portfolioUrl"
            type="url"
            className="input-field"
            placeholder="https://your-portfolio.com"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-[rgb(var(--border))]">
          <button onClick={handleSave} disabled={isSaving} className="btn-primary">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile
              </>
            )}
          </button>
          {saved && (
            <span className="text-sm text-emerald-500 animate-fade-in">✓ Profile saved</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
