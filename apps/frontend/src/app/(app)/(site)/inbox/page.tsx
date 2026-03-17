export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { InboxComponent } from '@gitroom/frontend/components/inbox/inbox.component';

export const metadata: Metadata = {
  title: 'roro tiktok - Inbox',
  description: '',
};

export default async function Page() {
  return <InboxComponent />;
}
