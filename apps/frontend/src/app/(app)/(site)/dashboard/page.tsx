export const dynamic = 'force-dynamic';
import { DashboardComponent } from '@gitroom/frontend/components/dashboard/dashboard.component';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roro TikTok - Dashboard',
  description: '',
};

export default async function Index() {
  return <DashboardComponent />;
}
