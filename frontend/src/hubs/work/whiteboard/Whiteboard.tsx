import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
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
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<'pen' | 'rectangle' | 'circle' | 'text' | 'eraser'>('pen');
  const [color, setColor] = useState('#6366f1');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      const response = await apiClient.get('/work/whiteboards');
      setWhiteboards(response.data.data || response.data);
    } catch (error) {
      console.warn('Backend /work/whiteboards not found, using mocks');
      setWhiteboards([
        { id: 'wb1', name: 'Q2 Strategy Map', collaborators: ['John', 'Sarah'] },
        { id: 'wb2', name: 'System Architecture v2', collaborators: ['Emily'] }
      ]);
    }
  };

  const loadBoard = (id: string) => {
    setSelectedBoard(id);
    // Mock shape loading
    setShapes([
      { id: 1, type: 'rectangle', x: 100, y: 100, width: 200, height: 120, color: '#4f46e5' },
      { id: 2, type: 'text', x: 120, y: 140, text: 'Strategic Pillar 1', color: '#ffffff' }
    ]);
  };

  const tools = [
    { id: 'pen', icon: '🖋️', label: 'Pen' },
    { id: 'rectangle', icon: '▯', label: 'Rect' },
    { id: 'circle', icon: '○', label: 'Circ' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Strategy Whiteboard</h1>
          <p className="text-text-400 mt-1 italic">Real-time collaborative canvas for infinite brainstorming</p>
        </div>
        <Button variant="primary">+ New Canvas</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <Card className="lg:col-span-1 border-r border-border-12 h-fit">
          <CardHeader>
            <h3 className="text-xs font-black text-text-500 uppercase tracking-widest">Active Boards</h3>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {whiteboards.map(wb => (
              <button
                key={wb.id}
                onClick={() => loadBoard(wb.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${selectedBoard === wb.id ? 'bg-primary-500/10 text-primary-400' : 'text-text-400 hover:bg-bg-800 hover:text-text-100'}`}
              >
                {wb.name}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-5 space-y-4">
          {selectedBoard ? (
            <>
              <Card className="bg-surface-800/80 backdrop-blur-md border-border-12 shadow-2xl">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id as any)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${selectedTool === tool.id ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/20' : 'bg-bg-900 border-border-12 text-text-400 hover:text-text-100'}`}
                        title={tool.label}
                      >
                        {tool.icon}
                      </button>
                    ))}
                    <div className="w-px h-8 bg-border-12 mx-2" />
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 bg-transparent cursor-pointer rounded-xl overflow-hidden border border-border-12"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info" className="animate-pulse">Live: 3 Users</Badge>
                    <Button variant="secondary" size="sm">Export SVG</Button>
                    <Button variant="primary" size="sm">Share</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-bg-900 border-border-12 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={600}
                  className="w-full h-[600px] cursor-crosshair relative z-10"
                />
                {/* Render Mock Shapes */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  {shapes.map(s => (
                    <div
                      key={s.id}
                      style={{
                        position: 'absolute',
                        left: s.x,
                        top: s.y,
                        width: s.width,
                        height: s.height,
                        backgroundColor: s.type !== 'text' ? s.color : 'transparent',
                        border: s.type === 'text' ? 'none' : `2px solid ${s.color}66`,
                        borderRadius: s.type === 'circle' ? '50%' : '8px'
                      }}
                      className="flex items-center justify-center shadow-xl"
                    >
                      {s.text && <span className="text-sm font-bold text-white selection:bg-primary-500">{s.text}</span>}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="bg-bg-800/30 border-dashed border-2 border-border-12 h-[600px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface-800 flex items-center justify-center text-4xl mb-6 shadow-2xl">🎨</div>
              <h2 className="text-2xl font-bold text-text-100 italic font-serif">Empty Workspace</h2>
              <p className="text-text-500 mt-2 max-w-xs italic">Select an active board from the registry to begin high-fidelity strategy mapping.</p>
              <Button variant="primary" className="mt-8">+ Create New Framework</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
