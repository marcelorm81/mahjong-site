import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  icon: LucideIcon;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
        <Icon size={40} className="text-white/20" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">{title}</h2>
      <p className="text-white/40 max-w-xs mx-auto">This page is under construction. Check back later for updates!</p>
    </div>
  );
};