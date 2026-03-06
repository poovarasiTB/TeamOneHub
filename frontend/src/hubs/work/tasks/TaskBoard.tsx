import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useTaskStore, Task } from '../../../store/taskStore';
import { LoadingTable } from '../../../components/Loading';

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'border-info' },
  { id: 'in-progress', title: 'Discovery', color: 'border-warning' },
  { id: 'review', title: 'Quality Assurance', color: 'border-primary-500' },
  { id: 'done', title: 'Shipped', color: 'border-success' },
];

export function TaskBoard() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading && tasks.length === 0) {
    return <LoadingTable rows={5} columns={4} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Task Orchestration</h1>
          <p className="text-text-400 mt-1 italic">Cross-project operational visibility and execution throughput</p>
        </div>
        <Button variant="primary">+ Orchestrate Task</Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-80">
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                <h3 className="text-sm font-black text-text-100 uppercase tracking-widest italic">{col.title}</h3>
                <Badge variant="default">{colTasks.length}</Badge>
              </div>
              <div className="space-y-4">
                {colTasks.map((task) => (
                  <Card key={task.id} className="bg-bg-800/50 hover:bg-bg-800 transition-all border-border-12 hover:border-primary-500/30 cursor-pointer group shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono text-text-500">{task.code}</span>
                        <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'info'} className="text-[8px] px-1 py-0">
                          {task.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-text-100 group-hover:text-primary-400 transition-colors leading-snug">{task.title}</h4>
                      <div className="mt-4 pt-3 border-t border-border-12 flex justify-between items-center">
                        <span className="text-[10px] text-text-500 italic truncate max-w-[150px]">{task.assigneeName || 'Unassigned'}</span>
                        <span className="text-[10px] text-text-600 font-mono italic">{task.dueDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
