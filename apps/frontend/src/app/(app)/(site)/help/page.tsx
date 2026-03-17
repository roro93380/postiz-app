export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { HelpCenter } from '@gitroom/frontend/components/help/help.center';

export const metadata: Metadata = {
  title: 'roro tiktok - Aide',
  description: '',
};

export default async function Page() {
  return <HelpCenter />;
}
