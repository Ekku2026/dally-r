import React from 'react';
import { Home, CheckSquare, Clock, Calendar, User, Plus, BarChart3 } from 'lucide-react';
import { ActiveTab } from '../types';
import { translations } from '../utils/translations';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenTaskModal: () => void;
  language: 'hi' | 'en';
  pendingTasksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenTaskModal,
  language,
  pendingTasksCount,
}) => {
  const t = translations[language];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Home Tab */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home size={20} className={activeTab === 'dashboard' ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] mt-0.5">{t.nav.home}</span>
        </button>

        {/* Tasks Tab */}
        <button
          onClick={() => onChangeTab('tasks')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${
            activeTab === 'tasks'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <CheckSquare size={20} className={activeTab === 'tasks' ? 'stroke-[2.5]' : ''} />
            {pendingTasksCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                {pendingTasksCount > 9 ? '9+' : pendingTasksCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">{t.nav.tasks}</span>
        </button>

        {/* Floating Quick Add Button in Center */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenTaskModal}
            title={t.nav.addTask}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95 transition transform border-4 border-slate-50 dark:border-slate-950"
          >
            <Plus size={26} className="stroke-[3]" />
          </button>
        </div>

        {/* Routine Tab */}
        <button
          onClick={() => onChangeTab('routine')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'routine'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock size={20} className={activeTab === 'routine' ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] mt-0.5">{t.nav.routine}</span>
        </button>

        {/* Calendar Tab */}
        <button
          onClick={() => onChangeTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'calendar'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar size={20} className={activeTab === 'calendar' ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] mt-0.5">{t.nav.calendar}</span>
        </button>

        {/* Profile / Progress Tab */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'profile' || activeTab === 'analytics'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User size={20} className={activeTab === 'profile' ? 'stroke-[2.5]' : ''} />
          <span className="text-[11px] mt-0.5">{t.nav.profile}</span>
        </button>
      </div>
    </div>
  );
};
