import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingPage } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAsset({
        id: parseInt(id!),
        code: 'AST-2026-001',
        name: 'MacBook Pro 16"',
        type: 'hardware',
        category: 'Laptop',
        status: 'active',
        serialNumber: 'C02XY1ABCD12',
        manufacturer: 'Apple',
        model: 'MacBook Pro 16" 2023',
        purchaseDate: '2024-01-10',
        purchaseCost: 2899,
        warrantyEndDate: '2027-01-10',
        assignedTo: 'John Doe',
        assignedToType: 'employee',
        location: 'Bangalore Office, Floor 3, Desk 45',
        specifications: {
          cpu: 'M2 Pro (12-core)',
          ram: '32GB',
          storage: '1TB SSD',
          screen: '16" Liquid Retina XDR',
          os: 'macOS Sonoma 14.2',
        },
      });
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      toast.success('Asset deleted successfully');
      navigate('/assets/assets');
    }
  };

  if (isLoading || !asset) {
    return <LoadingPage message="Loading asset..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-text-400 font-mono">{asset.code}</span>
            <Badge variant="success">{asset.status}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-100">{asset.name}</h1>
          <p className="text-text-400 mt-1">{asset.category} • {asset.manufacturer}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/assets/assets/${id}/edit`)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Basic Information</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Asset Code</dt>
                <dd className="text-text-100 font-mono">{asset.code}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Serial Number</dt>
                <dd className="text-text-100 font-mono">{asset.serialNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Type</dt>
                <dd>
                  <Badge variant={
                    asset.type === 'hardware' ? 'primary' :
                    asset.type === 'software' ? 'success' :
                    asset.type === 'cloud' ? 'info' : 'warning'
                  }>
                    {asset.type}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Assignment</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Assigned To</dt>
                <dd className="text-text-100">{asset.assignedTo}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Assignment Type</dt>
                <dd className="text-text-100 capitalize">{asset.assignedToType}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Location</dt>
                <dd className="text-text-100">{asset.location}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Purchase Information</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Purchase Date</dt>
                <dd className="text-text-100">{new Date(asset.purchaseDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Purchase Cost</dt>
                <dd className="text-text-100">${asset.purchaseCost.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Warranty End Date</dt>
                <dd className="text-text-100">{new Date(asset.warrantyEndDate).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Specifications</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(asset.specifications).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm text-text-400 capitalize">{key}</dt>
                <dd className="text-text-100">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to={`/assets/assets/${id}/maintenance`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="text-lg font-semibold text-text-100">Maintenance</h3>
              <p className="text-sm text-text-400 mt-1">View maintenance history</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/assets/assets/${id}/transfer`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-text-100">Transfer</h3>
              <p className="text-sm text-text-400 mt-1">Transfer to another user</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/assets/assets/${id}/documents`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-lg font-semibold text-text-100">Documents</h3>
              <p className="text-sm text-text-400 mt-1">View documents</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/assets/assets/${id}/timeline`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-text-100">Timeline</h3>
              <p className="text-sm text-text-400 mt-1">View lifecycle</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
