import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { WikiArticles } from './wiki/WikiArticles';
import { MeetingsCalendar } from './meetings/MeetingsCalendar';
import { Campaigns } from './campaigns/Campaigns';
import { IdeaBox } from './ideas/IdeaBox';
import { MeetingIntelligence } from './meetings/MeetingIntelligence';
import { MarketingAutomation } from './campaigns/MarketingAutomation';

export function GrowthHub() {
  const location = useLocation();

  const tabs = [
    { name: 'Wiki', path: '/growth/wiki' },
    { name: 'Calendar', path: '/growth/meetings' },
    { name: 'Meeting Intel', path: '/growth/intel' },
    { name: 'Marketing', path: '/growth/campaigns' },
    { name: 'Automation', path: '/growth/automation' },
    { name: 'Ideas', path: '/growth/ideas' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-navigation */}
      <div className="flex border-b border-border-12 px-8 bg-bg-900/50 backdrop-blur-md sticky top-0 z-10 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path) ||
            (tab.path === '/growth/wiki' && location.pathname === '/growth');
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive
                ? 'text-primary-400 border-primary-400'
                : 'text-text-400 border-transparent hover:text-text-100 hover:border-border-12'
                }`}
            >
              {tab.name}
            </NavLink>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="wiki" replace />} />
            <Route path="wiki" element={<WikiArticles />} />
            <Route path="meetings" element={<MeetingsCalendar />} />
            <Route path="intel" element={<MeetingIntelligence />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="automation" element={<MarketingAutomation />} />
            <Route path="ideas" element={<IdeaBox />} />
            <Route path="*" element={<Navigate to="wiki" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
