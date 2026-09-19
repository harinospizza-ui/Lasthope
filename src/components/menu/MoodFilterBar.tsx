import React from 'react';
import { HapticsService } from '../../services/hapticsService';

export type MoodFilterType = 'all' | 'trending' | 'cheesy' | 'spicy' | 'under199' | 'sides_quick';

export interface MoodFilterOption {
  id: MoodFilterType;
  label: string;
  emoji: string;
  badge?: string;
}

interface MoodFilterBarProps {
  activeMood: MoodFilterType;
  onSelectMood: (moodId: MoodFilterType) => void;
}

export const MOOD_OPTIONS: MoodFilterOption[] = [
  { id: 'all', label: 'All Flavors', emoji: '✨' },
  { id: 'trending', label: 'Trending Now', emoji: '🔥', badge: 'Popular' },
  { id: 'cheesy', label: 'Cheese Overload', emoji: '🧀' },
  { id: 'spicy', label: 'Spicy Mood', emoji: '🌶️' },
  { id: 'under199', label: 'Under ₹199', emoji: '💸', badge: 'Saver' },
  { id: 'sides_quick', label: 'Quick Bites', emoji: '🍟' },
];

export const MoodFilterBar: React.FC<MoodFilterBarProps> = ({ activeMood, onSelectMood }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-slate-800 tracking-wider uppercase font-display">
            Cravings & Mood
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {activeMood === 'all' ? 'Showing All' : 'Filtered'}
        </span>
      </div>

      {/* Horizontal scrolling pill container */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => {
                void HapticsService.light();
                onSelectMood(mood.id);
              }}
              className={`group shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all duration-200 active:scale-95 select-none ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/25 border border-slate-900 scale-105'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 shadow-sm'
              }`}
            >
              <span className="text-sm">{mood.emoji}</span>
              <span>{mood.label}</span>
              {mood.badge && (
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-red-50 text-red-600 border border-red-200/60'
                }`}>
                  {mood.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodFilterBar;
