import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProjectList } from './projects/ProjectList';
import { ProjectDetail } from './projects/ProjectDetail';
import { CreateProject } from './projects/CreateProject';
import { TaskBoard } from './tasks/TaskBoard';
import { TaskDetail } from './tasks/TaskDetail';
import { Whiteboard } from './whiteboard/Whiteboard';

export function WorkHub() {
  return (
    <div className="work-hub">
      <Routes>
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/tasks" element={<TaskBoard />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </div>
  );
}
