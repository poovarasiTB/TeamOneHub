import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useIdeaStore, Idea } from '../../../store/ideaStore';
import toast from 'react-hot-toast';

export function IdeaBox() {
  const { ideas, fetchIdeas, createIdea, upvote, downvote, removeVote, userVotes, isLoading, error } = useIdeaStore();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Idea>>({
    title: '',
    description: '',
    category: 'Feature',
    status: 'submitted',
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await createIdea(formData);
      toast.success('Idea submitted successfully!');
      setShowSubmitForm(false);
      setFormData({ title: '', description: '', category: 'Feature', status: 'submitted' });
    } catch (err) {
      toast.error('Failed to submit idea');
    }
  };

  const handleUpvote = async (id: string) => {
    if (userVotes.get(id) === 'up') {
      await removeVote(id);
    } else {
      await upvote(id);
    }
  };

  const handleDownvote = async (id: string) => {
    if (userVotes.get(id) === 'down') {
      await removeVote(id);
    } else {
      await downvote(id);
    }
  };

  if (isLoading && ideas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading ideas...</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    submitted: 'bg-bg-600 text-text-400',
    'under-review': 'bg-warning/20 text-warning',
    approved: 'bg-info/20 text-info',
    'in-progress': 'bg-primary/20 text-primary-400',
    implemented: 'bg-success/20 text-success',
    rejected: 'bg-error/20 text-error',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Idea Box</h1>
          <p className="text-text-400 mt-1">Submit and vote on ideas</p>
        </div>
        <Button variant="primary" onClick={() => setShowSubmitForm(true)}>+ Submit Idea</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Submit Form */}
      {showSubmitForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Submit New Idea</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief title for your idea"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Describe your idea in detail"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Feature">Feature</option>
                  <option value="UX">UX Improvement</option>
                  <option value="Product">Product</option>
                  <option value="Integration">Integration</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Submit Idea</Button>
                <Button type="button" variant="secondary" onClick={() => setShowSubmitForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-400">
            <p className="text-xl mb-4">No ideas yet</p>
            <p>Be the first to submit an idea!</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <Card key={idea.id} className="hover:bg-surface-650 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={statusColors[idea.status] ? 'custom' : 'secondary'} className={statusColors[idea.status]}>
                        {idea.status.replace('-', ' ')}
                      </Badge>
                      {idea.category && <Badge variant="info">{idea.category}</Badge>}
                    </div>
                    <h3 className="text-xl font-semibold text-text-100 mb-2">{idea.title}</h3>
                    <p className="text-text-400">{idea.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvote(idea.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                          userVotes.get(idea.id) === 'up'
                            ? 'bg-success/20 text-success'
                            : 'bg-bg-700 text-text-400 hover:bg-success/20 hover:text-success'
                        }`}
                      >
                        <span>👍</span>
                        <span className="font-medium">{idea.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleDownvote(idea.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                          userVotes.get(idea.id) === 'down'
                            ? 'bg-error/20 text-error'
                            : 'bg-bg-700 text-text-400 hover:bg-error/20 hover:text-error'
                        }`}
                      >
                        <span>👎</span>
                        <span className="font-medium">{idea.downvotes}</span>
                      </button>
                    </div>
                    <span className="text-sm text-text-500">
                      {idea.submitterName || 'Anonymous'} • {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-text-500">
                    Score: <span className="font-semibold text-text-100">{idea.upvotes - idea.downvotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
