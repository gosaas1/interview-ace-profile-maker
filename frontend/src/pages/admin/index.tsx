import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, FileText, Briefcase, DollarSign, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Metrics {
  totalUsers: number;
  totalCVs: number;
  totalApplications: number;
  monthlyApiCost: number;
  activeAdmins: number;
}

export default function AdminIndexPage() {
  const { user, loading } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    // TODO: Replace with real API call
    setMetrics({
      totalUsers: 1240,
      totalCVs: 3200,
      totalApplications: 2100,
      monthlyApiCost: 87.45,
      activeAdmins: 3,
    });
  }, []);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (user.user_metadata?.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold text-xl">403 Forbidden: Admins only</div>;
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 flex items-center gap-6">
            <Users className="h-10 w-10 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{metrics?.totalUsers ?? '--'}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-6">
            <FileText className="h-10 w-10 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{metrics?.totalCVs ?? '--'}</div>
              <div className="text-gray-600">Total CVs</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-6">
            <Briefcase className="h-10 w-10 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{metrics?.totalApplications ?? '--'}</div>
              <div className="text-gray-600">Total Applications</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-6">
            <DollarSign className="h-10 w-10 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">£{metrics?.monthlyApiCost?.toFixed(2) ?? '--'}</div>
              <div className="text-gray-600">Monthly API Cost</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-6">
            <Shield className="h-10 w-10 text-emerald-600" />
            <div>
              <div className="text-2xl font-bold">{metrics?.activeAdmins ?? '--'}</div>
              <div className="text-gray-600">Active Admins</div>
            </div>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 