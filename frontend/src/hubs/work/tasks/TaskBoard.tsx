import React, { useEffect, useState } from 'react';
import { useTaskStore, Task } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-bg-600' },
  { id: 'todo', title: 'To Do', color: 'bg-info/20' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-warning/20' },
  { id: 'review', title: 'Review', color: 'bg-primary/20' },
  { id: 'done', title: 'Done', color: 'bg-success/20' },
];

export function TaskBoard() {
  const { tasks, fetchTasks, updateTaskStatus, isLoading, error } = useTaskStore();
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    fetchTasks(selectedProject || undefined);
  }, [selectedProject]);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await updateTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const priorityColors: Record<string, string> = {
    urgent: 'bg-error/20 text-error border-error',
    high: 'bg-warning/20 text-warning border-warning',
    medium: 'bg-info/20 text-info border-info',
    low: 'bg-bg-600 text-text-400 border-bg-500',
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Task Board</h1>
          <p className="text-text-400 mt-1">Manage and track all tasks</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 bg-surface-700 border border-border-600 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-700/30">
            + New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
            >
              <div className={`${column.color} rounded-xl p-4 mb-4 min-h-[500px]`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-text-100">{column.title}</h3>
                  <span className="px-2 py-1 bg-bg-700 rounded-lg text-xs text-text-400">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      priorityColors={priorityColors}
                      onDragStart={handleDragStart}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-center text-text-500 text-sm py-8">
                      Drop tasks here
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  priorityColors: Record<string, string>;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

function TaskCard({ task, priorityColors, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-surface-700 rounded-lg p-4 border-l-4 border-l-primary-500 cursor-pointer hover:bg-surface-650 transition-colors"
    >
      <h4 className="text-text-100 font-medium mb-2">{task.title}</h4>
      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        {task.assigneeName && (
          <span className="text-xs text-text-400">{task.assigneeName}</span>
        )}
      </div>
      {task.dueDate && (
        <div className="mt-2 text-xs text-text-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
