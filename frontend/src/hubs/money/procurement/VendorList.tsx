import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useVendorStore } from '../../../store/vendorStore';
import { LoadingTable } from '../../../components/Loading';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

export function VendorList() {
    const { vendors, fetchVendors, isLoading } = useVendorStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Vendors</h1>
                    <p className="text-text-400 mt-1">Manage your supply chain and vendors</p>
                </div>
                <Button variant="primary">+ Add Vendor</Button>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <ErrorBoundary>
                        {isLoading ? (
                            <LoadingTable rows={5} columns={5} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-bg-800/50">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-400 uppercase tracking-wider">Vendor Name</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-400 uppercase tracking-wider">Category</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-400 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-400 uppercase tracking-wider">Total Spent</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-12">
                                        {filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className="hover:bg-bg-800/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="text-text-100 font-medium">{vendor.name}</p>
                                                        <p className="text-xs text-text-400">{vendor.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge variant="info" size="sm">{vendor.category}</Badge>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge variant={vendor.status === 'active' ? 'success' : 'default'} size="sm">
                                                        {vendor.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 text-text-100 font-semibold font-mono">
                                                    ${vendor.totalSpent?.toLocaleString() || '0'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                                                        Manage →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredVendors.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-text-400">
                                                    {searchTerm ? 'No vendors match your search.' : 'No vendors onboarded yet.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </ErrorBoundary>
                </CardContent>
            </Card>
        </div>
    );
}
