import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useGrowthStore } from '../../../store/growthStore';
import { LoadingTable } from '../../../components/Loading';

export function WikiArticles() {
  const { wikiArticles, fetchWikiArticles, isLoading } = useGrowthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWikiArticles();
  }, [fetchWikiArticles]);

  if (isLoading && wikiArticles.length === 0) {
    return <LoadingTable rows={5} columns={3} />;
  }

  const filtered = wikiArticles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Institutional Knowledge</h1>
          <p className="text-text-400 mt-1 italic">Collaborative wiki and engineering documentation</p>
        </div>
        <Button variant="primary">+ New Article</Button>
      </div>

      <Card className="bg-bg-800/50 border-primary-500/10">
        <CardContent className="p-4 flex gap-4">
          <input
            type="text"
            placeholder="Search wiki by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-bg-900 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:ring-2 focus:ring-primary-500"
          />
          <Badge variant="info">KB v4.2.0</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((article) => (
          <Card key={article.id} className="hover:border-primary-500/30 transition-all group cursor-pointer shadow-xl hover:shadow-primary-500/5">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-text-100 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{article.title}</h3>
                <Badge variant="default" className="text-[9px]">{article.category}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] text-text-500 italic">By {article.authorName}</p>
                <p className="text-[10px] text-text-600">•</p>
                <p className="text-[10px] text-text-500">Last updated {new Date(article.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-400 leading-relaxed line-clamp-3 mb-6">
                {article.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[9px] bg-bg-800 text-text-500 px-2 py-0.5 rounded border border-border-12 uppercase">#{tag}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
