import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useGrowthStore } from '../../../store/growthStore';
import toast from 'react-hot-toast';

export function IdeaBox() {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Feature',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Idea submitted for review!');
    setShowSubmitForm(false);
    setFormData({ title: '', description: '', category: 'Feature' });
  };

  const mockIdeas = [
    {
      id: '1',
      title: 'Dark Mode Auto-Switch',
      description: 'System should automatically switch based on OS settings.',
      category: 'UX',
      votes: 42,
      status: 'under-review',
    },
    {
      id: '2',
      title: 'Offline Syncing',
      description: 'Allow users to work on projects while offline and sync later.',
      category: 'Feature',
      votes: 128,
      status: 'approved',
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-text-100">Idea Box</h1>
          <p className="text-text-400 mt-1">Crowdsource innovation from your team</p>
        </div>
        <Button variant="primary" onClick={() => setShowSubmitForm(true)}>+ New Idea</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockIdeas.map((idea) => (
          <Card key={idea.id} className="hover:border-primary-500/30 transition-all group">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge variant="info">{idea.category}</Badge>
                  <h3 className="text-xl font-bold text-text-100 group-hover:text-primary-400 transition-colors">
                    {idea.title}
                  </h3>
                </div>
                <div className="text-center bg-bg-800 p-2 rounded-xl border border-border-12 min-w-[60px]">
                  <p className="text-xs text-text-400 uppercase font-bold">Votes</p>
                  <p className="text-xl font-black text-primary-400">{idea.votes}</p>
                </div>
              </div>
              <p className="text-text-400 text-sm leading-relaxed">
                {idea.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <Badge variant={idea.status === 'approved' ? 'success' : 'warning'}>
                  {idea.status}
                </Badge>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-bg-800 rounded-lg text-text-400 hover:text-success transition-colors">
                    👍 Upvote
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showSubmitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl border-primary-500/20">
            <CardHeader>
              <h2 className="text-xl font-bold text-text-100">Submit Idea</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-100">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Short title for your idea"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-100">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100"
                  >
                    <option value="Feature">Feature</option>
                    <option value="UX">UX Improvement</option>
                    <option value="Process">Process</option>
                    <option value="Product">New Product</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-100">Detailed Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-32 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 resize-none"
                    placeholder="Describe how this helps the team..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowSubmitForm(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
