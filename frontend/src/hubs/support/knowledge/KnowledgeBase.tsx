import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useKnowledgeStore, KnowledgeArticle } from '../../../store/knowledgeStore';

export function KnowledgeBase() {
  const { articles, categories, fetchArticles, fetchCategories, isLoading, error } = useKnowledgeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const filters: any = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.categoryId = selectedCategory;
    fetchArticles(filters);
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Knowledge Base</h1>
          <p className="text-text-400 mt-1">Help articles and documentation</p>
        </div>
        <Button variant="primary">+ New Article</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 placeholder-text-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="primary" onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="cursor-pointer hover:bg-surface-650 transition-colors" onClick={() => setSelectedCategory(cat.id)}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-text-100 font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-text-400">{cat.articleCount} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Articles */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">
            {selectedCategory ? 'Filtered Articles' : 'All Articles'}
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border-12">
            {articles.length === 0 ? (
              <div className="p-6 text-center text-text-400">
                No articles found
              </div>
            ) : (
              articles.map((article) => (
                <ArticleRow key={article.id} article={article} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArticleRow({ article }: { article: KnowledgeArticle }) {
  return (
    <div className="p-6 hover:bg-bg-800/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={`/support/knowledge/${article.id}`}
              className="text-lg text-primary-400 hover:text-primary-300 font-medium"
            >
              {article.title}
            </Link>
            <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
              {article.status}
            </Badge>
            {article.categoryName && <Badge variant="info">{article.categoryName}</Badge>}
          </div>
          {article.excerpt && (
            <p className="text-text-400 text-sm mb-2">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-text-400">
            <span>👁️ {article.views.toLocaleString()} views</span>
            <span>👍 {article.likes} helpful</span>
            {article.authorName && <span>• By {article.authorName}</span>}
          </div>
        </div>
        <Link
          to={`/support/knowledge/${article.id}`}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Read →
        </Link>
      </div>
    </div>
  );
}
