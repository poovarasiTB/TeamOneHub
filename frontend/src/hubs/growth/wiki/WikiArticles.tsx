import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useWikiStore } from '../../../store/wikiStore';

export function WikiArticles() {
  const { articles, categories, fetchArticles, fetchCategories, isLoading, error } = useWikiStore();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

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

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Wiki Articles</h1>
          <p className="text-text-400 mt-1">Knowledge base and documentation</p>
        </div>
        <Link to="/growth/wiki/new">
          <Button variant="primary">+ New Article</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Articles</p>
            <p className="text-3xl font-bold text-text-100">{articles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Published</p>
            <p className="text-3xl font-bold text-success">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Drafts</p>
            <p className="text-3xl font-bold text-warning">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Views</p>
            <p className="text-3xl font-bold text-primary-400">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="cursor-pointer hover:bg-surface-650 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-text-100 font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-text-400">{cat.articleCount} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">All Articles</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Views</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Updated</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-400">
                      No articles found. Create the first one!
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/growth/wiki/${article.id}`} className="text-primary-400 hover:text-primary-300 font-medium">
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {article.categoryName && <Badge variant="info">{article.categoryName}</Badge>}
                      </td>
                      <td className="px-6 py-4 text-text-400">{article.authorName || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={article.status === 'published' ? 'success' : article.status === 'draft' ? 'warning' : 'secondary'}>
                          {article.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-400">{article.views.toLocaleString()}</td>
                      <td className="px-6 py-4 text-text-400">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/growth/wiki/${article.id}/edit`} className="text-primary-400 hover:text-primary-300 text-sm">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
