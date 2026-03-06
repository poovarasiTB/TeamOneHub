import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore, Task } from '../../../store/taskStore';
import { Card, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { LoadingSpinner } from '../../../components/Loading';

const DEFAULT_COLUMNS = [
    { id: 'backlog', title: 'Backlog', status: 'backlog' },
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'done', title: 'Done', status: 'done' }
];

export function AgileBoard() {
    const { id: projectId } = useParams();
    const { tasks, fetchTasks, updateTaskStatus, isLoading } = useTaskStore();
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            fetchTasks(projectId);
        }
    }, [projectId]);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        // Small timeout to allow the dragged element to become translucent
        setTimeout(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = '0.4';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedTaskId(null);
        if (e.target instanceof HTMLElement) {
            e.target.style.opacity = '1';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
        e.preventDefault();
        if (!draggedTaskId) return;

        const task = tasks.find(t => t.id === draggedTaskId);
        if (task && task.status !== status) {
            await updateTaskStatus(draggedTaskId, status);
        }
        setDraggedTaskId(null);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-error text-white';
            case 'high': return 'bg-warning text-bg-900';
            case 'medium': return 'bg-primary-500 text-white';
            case 'low': return 'bg-bg-700 text-text-400';
            default: return 'bg-bg-700 text-text-400';
        }
    };

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Agile Board</h1>
                    <p className="text-text-400 mt-1">Drag and drop tasks to update their status</p>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full min-w-max pb-4">
                    {DEFAULT_COLUMNS.map(column => {
                        const columnTasks = tasks.filter(t => t.status === column.status);

                        return (
                            <div
                                key={column.id}
                                className="w-80 flex flex-col bg-bg-900/50 rounded-xl border border-border-12"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, column.status as Task['status'])}
                            >
                                <div className="p-4 border-b border-border-12 flex justify-between items-center bg-bg-800/50 rounded-t-xl">
                                    <h3 className="font-semibold text-text-100">{column.title}</h3>
                                    <Badge variant="default" className="text-xs">{columnTasks.length}</Badge>
                                </div>

                                <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                                    {columnTasks.map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            onDragEnd={handleDragEnd}
                                            className="cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                                        >
                                            <Card className="border border-border-12 hover:border-primary-500/50 shadow-sm bg-bg-800">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-mono text-text-500">{task.code}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-sm font-medium text-text-100 mb-3 leading-snug">
                                                        {task.title}
                                                    </h4>

                                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-12">
                                                        <div className="flex -space-x-2">
                                                            {task.assigneeId ? (
                                                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-bg-800" title={task.assigneeName}>
                                                                    {task.assigneeName?.charAt(0).toUpperCase() || '?'}
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-bg-700 flex items-center justify-center text-[10px] text-text-500 border-2 border-bg-800" title="Unassigned">
                                                                    ?
                                                                </div>
                                                            )}
                                                        </div>
                                                        {task.estimatedHours && (
                                                            <div className="text-xs text-text-500 flex items-center gap-1">
                                                                <span>⏱️</span> {task.estimatedHours}h
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}

                                    {columnTasks.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-border-12 rounded-xl flex items-center justify-center">
                                            <p className="text-sm text-text-500">Drop tasks here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
