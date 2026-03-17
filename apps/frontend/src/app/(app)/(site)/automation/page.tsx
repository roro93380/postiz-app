export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AutomationBuilder } from '@gitroom/frontend/components/automation/automation.builder';

export const metadata: Metadata = {
  title: 'roro tiktok - Automation',
  description: '',
};

export default async function Page() {
  return <AutomationBuilder />;
}
