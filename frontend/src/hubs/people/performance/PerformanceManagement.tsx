import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { usePeopleStore } from '../../../store/peopleStore';
import { useAuthStore } from '../../../store/authStore';
import { LoadingTable } from '../../../components/Loading';

export function PerformanceManagement() {
    const { user } = useAuthStore();
    const { reviews, fetchReviews, isLoading } = usePeopleStore();
    const [showNewReview, setShowNewReview] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    if (isLoading && reviews.length === 0) {
        return <LoadingTable rows={5} columns={6} />;
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 'N/A';

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Talent Performance</h1>
                    <p className="text-text-400 mt-1 italic">Growth tracking and professional development</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Button variant="primary" onClick={() => setShowNewReview(true)}>+ New Review</Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Avg. Rating</p>
                        <h3 className="text-3xl font-bold text-primary-400 mt-1">{avgRating} <span className="text-sm text-text-500">/ 5.0</span></h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Completed</p>
                        <h3 className="text-3xl font-bold text-success mt-1">{reviews.filter(r => r.status === 'completed').length}</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">In Progress</p>
                        <h3 className="text-3xl font-bold text-warning mt-1">{reviews.filter(r => r.status === 'in-progress').length}</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Pending Self</p>
                        <h3 className="text-3xl font-bold text-text-100 mt-1">{reviews.filter(r => r.status === 'pending').length}</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-2xl shadow-black/10">
                <CardHeader>
                    <h2 className="text-xl font-bold text-text-100 italic font-serif">Review Cycles</h2>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Employee</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Reviewer</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Cycle Period</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Score</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-bg-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-text-100 font-medium">{review.employeeName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-400 text-sm">
                                        {review.reviewerName}
                                    </td>
                                    <td className="px-6 py-4 text-text-200">
                                        {new Date(review.periodStart).toLocaleDateString()} - {new Date(review.periodEnd).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {review.rating ? (
                                            <div className="inline-flex items-center bg-primary-500/10 px-2 py-1 rounded-lg">
                                                <span className="text-primary-400 font-bold">{review.rating}</span>
                                            </div>
                                        ) : (
                                            <Badge variant="default">N/A</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">Open Report</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
