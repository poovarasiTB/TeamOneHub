import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useSupportStore } from '../../../store/supportStore';
import { LoadingTable } from '../../../components/Loading';

export function KnowledgeBase() {
  const { articles, fetchArticles, isLoading } = useSupportStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (isLoading && articles.length === 0) {
    return <LoadingTable rows={5} columns={4} />;
  }

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Knowledge Repository</h1>
          <p className="text-text-400 mt-1 italic">High-fidelity self-service documentation and root cause analyses</p>
        </div>
        <Button variant="primary">+ Compose Article</Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-500">🔍</div>
        <input
          type="text"
          placeholder="Search resolution guides, whitepapers, and FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-bg-800/80 backdrop-blur-md border border-border-12 rounded-2xl pl-12 pr-4 py-4 text-text-100 focus:ring-2 focus:ring-primary-500 shadow-2xl transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((article) => (
          <Card key={article.id} className="hover:border-primary-500/30 transition-all group cursor-pointer shadow-xl overflow-hidden border-none bg-surface-800">
            <div className="h-1 bg-gradient-to-r from-primary-500/50 to-transparent" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="info" className="text-[9px] uppercase tracking-widest">{article.category}</Badge>
                <p className="text-[10px] text-text-600 font-black">KB#{article.id.padStart(4, '0')}</p>
              </div>
              <h3 className="text-lg font-bold text-text-100 group-hover:text-primary-400 transition-colors leading-tight italic">{article.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-400 leading-relaxed line-clamp-2 h-10 mb-6 italic">
                {article.content}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border-12">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] text-text-500 uppercase tracking-tighter">👁️ {article.views.toLocaleString()}</span>
                  <span className="text-[9px] text-success uppercase tracking-tighter">👍 {article.helpfulCount}</span>
                </div>
                <span className="text-[9px] text-text-600 uppercase italic">By {article.authorName}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
