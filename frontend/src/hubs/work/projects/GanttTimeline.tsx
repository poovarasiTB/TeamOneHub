import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore, Task } from '../../../store/taskStore';
import { LoadingSpinner } from '../../../components/Loading';

export function GanttTimeline() {
    const { id: projectId } = useParams();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const [viewMode, setViewMode] = useState<'Weeks' | 'Months'>('Weeks');

    useEffect(() => {
        if (projectId) fetchTasks(projectId);
    }, [projectId]);

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Filter tasks that have at least a due date (estimated start if start missing)
    const validTasks = tasks.map(t => {
        const end = t.dueDate ? new Date(t.dueDate) : new Date();
        // If no start date, assume 7 days before end date
        const start = t.createdAt ? new Date(t.createdAt) : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { ...t, start, end };
    }).sort((a, b) => a.start.getTime() - b.start.getTime());

    if (validTasks.length === 0) {
        return (
            <div className="p-12 text-center text-text-400">
                <div className="text-4xl mb-4">🗓️</div>
                No tasks with dates found to display on the timeline.
            </div>
        );
    }

    // Calculate timeline boundaries
    const minDate = new Date(Math.min(...validTasks.map(t => t.start.getTime())));
    const maxDate = new Date(Math.max(...validTasks.map(t => t.end.getTime())));

    // Pad the timeline by 2 weeks on each side
    minDate.setDate(minDate.getDate() - 14);
    maxDate.setDate(maxDate.getDate() + 14);

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-success';
            case 'review': return 'bg-info';
            case 'in-progress': return 'bg-primary-500';
            default: return 'bg-bg-500';
        }
    };

    // Generate grid columns (one for each day/week depending on scale)
    const renderGrid = () => {
        const columns = [];
        const currentDate = new Date(minDate);
        let columnWidth = viewMode === 'Weeks' ? 40 : 15; // px per day

        for (let i = 0; i < totalDays; i++) {
            if (viewMode === 'Weeks' && currentDate.getDay() === 1) { // Monday
                columns.push(
                    <div key={`grid-${i}`} className="absolute top-0 bottom-0 border-l border-border-12 w-px" style={{ left: `${i * columnWidth}px` }}>
                        <div className="text-[10px] text-text-500 -ml-4 -mt-6 bg-bg-900 px-1 rounded absolute whitespace-nowrap">
                            {currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                );
            } else if (viewMode === 'Months' && currentDate.getDate() === 1) { // 1st of month
                columns.push(
                    <div key={`grid-${i}`} className="absolute top-0 bottom-0 border-l border-border-12 w-px" style={{ left: `${i * columnWidth}px` }}>
                        <div className="text-[10px] text-text-500 -ml-4 -mt-6 bg-bg-900 px-1 rounded absolute whitespace-nowrap font-bold text-primary-500">
                            {currentDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return columns;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Project Timeline</h1>
                    <p className="text-text-400 mt-1">Interactive Gantt chart view</p>
                </div>
                <div className="flex gap-2 p-1 bg-bg-800 rounded-lg border border-border-12">
                    <button
                        onClick={() => setViewMode('Weeks')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'Weeks' ? 'bg-primary-500 text-white' : 'text-text-400 hover:text-text-100'}`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setViewMode('Months')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'Months' ? 'bg-primary-500 text-white' : 'text-text-400 hover:text-text-100'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-bg-900/50 border border-border-12 rounded-xl overflow-hidden flex flex-col relative">
                {/* Header row for dates */}
                <div className="h-12 border-b border-border-12 bg-bg-800/80 sticky top-0 z-10 flex">
                    <div className="w-64 min-w-[250px] max-w-[250px] border-r border-border-12 flex items-center px-4 font-semibold text-text-400 text-sm bg-bg-900 z-20 sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                        Task List
                    </div>
                    <div className="flex-1 relative overflow-hidden" id="gantt-header-scroll">
                        <div className="absolute top-10 w-full h-full">
                            {/* Labels are rendered in the grid layer mostly to sync with body */}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="flex-1 overflow-auto flex custom-scrollbar relative"
                    onScroll={(e) => {
                        const header = document.getElementById('gantt-header-scroll');
                        if (header) header.scrollLeft = e.currentTarget.scrollLeft - 250;
                    }}
                >
                    {/* Left Sidebar Fixed */}
                    <div className="w-64 min-w-[250px] max-w-[250px] border-r border-border-12 bg-bg-900 z-10 sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                        {validTasks.map(task => (
                            <div key={`sidebar-${task.id}`} className="h-14 border-b border-border-12/50 flex items-center px-4 hover:bg-bg-800 transition-colors cursor-pointer group truncate">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-sm font-medium text-text-100 truncate group-hover:text-primary-400 transition-colors">
                                        {task.title}
                                    </p>
                                    <p className="text-[10px] text-text-500 truncate font-mono mt-0.5">
                                        {task.code} • {task.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Grid & Bars */}
                    <div
                        className="relative"
                        style={{ width: `${totalDays * (viewMode === 'Weeks' ? 40 : 15)}px` }}
                    >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                            {renderGrid()}
                        </div>

                        {/* Bars */}
                        <div className="absolute inset-0 z-10 pt-2">
                            {validTasks.map((task, index) => {
                                const dayWidth = viewMode === 'Weeks' ? 40 : 15;
                                const top = index * 56; // 14 h-14 = 56px
                                const left = (task.start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
                                const width = Math.max((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24) * dayWidth, 20); // Min width 20px

                                return (
                                    <div key={`bar-${task.id}`} className="absolute h-14 w-full" style={{ top: `${top}px` }}>
                                        <div
                                            className={`absolute top-3 h-8 rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5 ${getStatusColor(task.status)} border border-white/10`}
                                            style={{ left: `${left}px`, width: `${width}px` }}
                                            title={`${task.title} (${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()})`}
                                        >
                                            <div className="truncate px-2 flex items-center h-full text-xs font-semibold text-white/90 group-hover:text-white pointer-events-none">
                                                {width > 60 && task.title}
                                            </div>

                                            {/* Tooltip on hover */}
                                            <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-bg-900 border border-border-12 p-3 rounded-lg shadow-xl w-48 text-left pointer-events-none">
                                                <p className="font-bold text-text-100 text-sm mb-1 line-clamp-2">{task.title}</p>
                                                <p className="text-xs text-text-400">{task.start.toLocaleDateString()} - {task.end.toLocaleDateString()}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></span>
                                                    <span className="text-xs capitalize text-text-300">{task.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 pt-2 text-sm text-text-400">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-bg-500"></span> Backlog / Todo</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary-500"></span> In Progress</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-info"></span> In Review</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success"></span> Completed</div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--tw-colors-border-12);
          border-radius: 20px;
        }
      `}</style>
        </div>
    );
}
