import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/Button';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Signed in as {user?.email}</p>
          </div>
          <Button variant="secondary" onClick={() => logout()}>
            Sign out
          </Button>
        </div>
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Application tracking, analytics, and AI analysis land in upcoming milestones.
        </div>
      </div>
    </div>
  );
}
