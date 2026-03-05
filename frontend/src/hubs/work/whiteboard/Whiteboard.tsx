import React, { useEffect, useState, useRef } from 'react';
import { useProjectStore } from '../../../store/projectStore';
import apiClient from '../../../lib/api';

interface WhiteboardContent {
  id: string;
  name: string;
  projectId?: string;
  content: any;
  collaborators: string[];
}

export function Whiteboard() {
  const { projects } = useProjectStore();
  const [whiteboards, setWhiteboards] = useState<WhiteboardContent[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<'pen' | 'rectangle' | 'circle' | 'text' | 'eraser'>('pen');
  const [color, setColor] = useState('#667eea');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      const response = await apiClient.get('/work/whiteboards');
      setWhiteboards(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch whiteboards:', error);
    }
  };

  const createWhiteboard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const response = await apiClient.post('/work/whiteboards', {
        name: newBoardName,
        projectId: selectedBoard || undefined,
        content: { shapes: [] },
      });
      setWhiteboards([...whiteboards, response.data]);
      setSelectedBoard(response.data.id);
      setIsCreating(false);
      setNewBoardName('');
    } catch (error) {
      console.error('Failed to create whiteboard:', error);
    }
  };

  const loadWhiteboard = async (id: string) => {
    setSelectedBoard(id);
    try {
      const response = await apiClient.get(`/work/whiteboards/${id}/content`);
      setShapes(response.data?.shapes || []);
    } catch (error) {
      console.error('Failed to load whiteboard:', error);
    }
  };

  const saveWhiteboard = async () => {
    if (!selectedBoard) return;
    try {
      await apiClient.put(`/work/whiteboards/${selectedBoard}/content`, {
        content: { shapes },
      });
    } catch (error) {
      console.error('Failed to save whiteboard:', error);
    }
  };

  const addShape = (type: string, x: number, y: number) => {
    const newShape = {
      id: Date.now(),
      type,
      x,
      y,
      width: type === 'text' ? 100 : 50,
      height: type === 'text' ? 30 : 50,
      color,
      text: type === 'text' ? 'Text' : '',
    };
    setShapes([...shapes, newShape]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      addShape(selectedTool, x, y);
    } else if (selectedTool === 'text') {
      addShape('text', x, y);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Whiteboard</h1>
          <p className="text-text-400 mt-1">Real-time collaborative canvas for brainstorming</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          + New Whiteboard
        </Button>
      </div>

      {/* Whiteboard Selector */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedBoard}
          onChange={(e) => loadWhiteboard(e.target.value)}
          className="px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select a whiteboard</option>
          {whiteboards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
        {selectedBoard && (
          <Button variant="secondary" onClick={saveWhiteboard}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Toolbar */}
      {selectedBoard && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <ToolButton
                  tool="pen"
                  selected={selectedTool === 'pen'}
                  onClick={() => setSelectedTool('pen')}
                  icon="✏️"
                />
                <ToolButton
                  tool="rectangle"
                  selected={selectedTool === 'rectangle'}
                  onClick={() => setSelectedTool('rectangle')}
                  icon="⬜"
                />
                <ToolButton
                  tool="circle"
                  selected={selectedTool === 'circle'}
                  onClick={() => setSelectedTool('circle')}
                  icon="⭕"
                />
                <ToolButton
                  tool="text"
                  selected={selectedTool === 'text'}
                  onClick={() => setSelectedTool('text')}
                  icon="📝"
                />
                <ToolButton
                  tool="eraser"
                  selected={selectedTool === 'eraser'}
                  onClick={() => setSelectedTool('eraser')}
                  icon="🧹"
                />
              </div>
              <div className="h-8 w-px bg-border-12" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-400">Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => setShapes([])}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canvas */}
      {selectedBoard ? (
        <Card>
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              width={1200}
              height={600}
              onClick={handleCanvasClick}
              className="w-full bg-white rounded-b-xl cursor-crosshair"
              style={{ maxHeight: '600px' }}
            />
            {/* Render shapes overlay */}
            <div className="relative" style={{ marginTop: '-600px', pointerEvents: 'none' }}>
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  style={{
                    position: 'absolute',
                    left: shape.x,
                    top: shape.y,
                    width: shape.width,
                    height: shape.height,
                    backgroundColor: shape.type !== 'text' ? shape.color : 'transparent',
                    borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'text' ? 0 : 4,
                    border: shape.type === 'text' ? `2px solid ${shape.color}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: shape.type === 'text' ? shape.color : 'transparent',
                    fontSize: '14px',
                  }}
                >
                  {shape.text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-text-100 mb-2">Select or Create a Whiteboard</h3>
            <p className="text-text-400">Choose an existing whiteboard or create a new one to start collaborating</p>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Create New Whiteboard</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-text-400 mb-2">Name</label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="My Whiteboard"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-text-400 mb-2">Project (Optional)</label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">No Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={createWhiteboard} className="flex-1">
                  Create
                </Button>
                <Button variant="secondary" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ToolButton({ tool, selected, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        selected ? 'bg-primary-500/20 border border-primary-500' : 'bg-bg-700 hover:bg-bg-600'
      }`}
      title={tool}
    >
      {icon}
    </button>
  );
}

function Card({ children, className }: any) {
  return <div className={`bg-surface-800 border border-border-12 rounded-xl ${className}`}>{children}</div>;
}

function CardHeader({ children }: any) {
  return <div className="px-6 py-4 border-b border-border-12">{children}</div>;
}

function CardContent({ children, className }: any) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Button({ children, variant, onClick, size, className }: any) {
  const variants: any = {
    primary: 'bg-primary-700 hover:bg-primary-600 text-white',
    secondary: 'bg-bg-700 hover:bg-bg-600 text-text-100',
    ghost: 'bg-transparent hover:bg-bg-700 text-text-400',
  };
  const sizes: any = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
  };
  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size || 'md']} rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
