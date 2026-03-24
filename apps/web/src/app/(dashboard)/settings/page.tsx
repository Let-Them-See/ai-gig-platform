'use client';

import { User, Bell, Shield, CreditCard, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">Settings</h1>

      {/* Profile Section */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-surface-900">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-1.5">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-1.5">Email</label>
              <input type="email" defaultValue="john@example.com" disabled className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-surface-800/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Headline</label>
            <input type="text" defaultValue="Senior ML Engineer" className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Bio</label>
            <textarea rows={4} defaultValue="Experienced ML engineer specializing in NLP and LLMs..." className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-surface-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {['New proposals on your gigs', 'Proposal status updates', 'Payment notifications', 'AI match alerts'].map(item => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-surface-800/80">{item}</span>
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-checked:bg-brand-500 rounded-full transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-surface-900">Social Links</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Website</label>
            <input type="url" placeholder="https://yoursite.com" className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">LinkedIn</label>
            <input type="url" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">GitHub</label>
            <input type="url" placeholder="https://github.com/..." className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
