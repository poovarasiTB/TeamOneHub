import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WikiArticles } from './wiki/WikiArticles';
import { MeetingsCalendar } from './meetings/MeetingsCalendar';
import { Campaigns } from './campaigns/Campaigns';
import { IdeaBox } from './ideas/IdeaBox';

export function GrowthHub() {
  return (
    <div className="growth-hub">
      <Routes>
        <Route path="/wiki" element={<WikiArticles />} />
        <Route path="/meetings" element={<MeetingsCalendar />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/ideas" element={<IdeaBox />} />
      </Routes>
    </div>
  );
}
