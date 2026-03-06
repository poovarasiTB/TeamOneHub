import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useDealStore, Deal } from '../../../store/dealStore';
import toast from 'react-hot-toast';

const STAGES = [
    { id: 'lead', name: 'Leads', color: 'bg-bg-700' },
    { id: 'qualified', name: 'Qualified', color: 'bg-primary-500/10' },
    { id: 'proposal', name: 'Proposal', color: 'bg-warning/10' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-info/10' },
    { id: 'closed_won', name: 'Closed Won', color: 'bg-success/10' },
];

export function CRMBoard() {
    const { deals, fetchDeals, updateDealStage, isLoading } = useDealStore();
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (stageId: string) => {
        if (draggedId) {
            await updateDealStage(draggedId, stageId);
            setDraggedId(null);
            toast.success(`Deal moved to ${stageId.replace('_', ' ')}`);
        }
    };

    if (isLoading && deals.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Sales Pipeline</h1>
                    <p className="text-text-400 mt-1">Manage and track your deals</p>
                </div>
                <Button variant="primary">+ New Deal</Button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 h-[calc(100vh-250px)] min-w-max pb-4">
                    {STAGES.map((stage) => (
                        <div
                            key={stage.id}
                            className={`w-80 flex flex-col rounded-2xl ${stage.color} border border-border-12 p-4`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(stage.id)}
                        >
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h3 className="font-semibold text-text-100 uppercase text-xs tracking-wider">
                                    {stage.name}
                                </h3>
                                <span className="text-xs text-text-400 bg-bg-800 px-2 py-0.5 rounded-full">
                                    {deals.filter((d) => d.stage === stage.id).length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                {deals
                                    .filter((d) => d.stage === stage.id)
                                    .map((deal) => (
                                        <div
                                            key={deal.id}
                                            draggable
                                            onDragStart={() => handleDragStart(deal.id)}
                                            className="bg-bg-800 border border-border-12 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary-500/50 transition-colors group shadow-sm"
                                        >
                                            <h4 className="font-medium text-text-100 mb-1 group-hover:text-primary-400">
                                                {deal.title}
                                            </h4>
                                            <p className="text-xs text-text-400 mb-3">{deal.customerName}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-text-100">
                                                    ${deal.amount.toLocaleString()}
                                                </span>
                                                <Badge variant={deal.probability > 70 ? 'success' : 'default'} size="sm">
                                                    {deal.probability}%
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                {deals.filter((d) => d.stage === stage.id).length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-border-12 rounded-xl flex items-center justify-center text-text-600 text-sm">
                                        Drop deals here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
