export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AccountsManager } from '@gitroom/frontend/components/accounts/accounts.manager';

export const metadata: Metadata = {
  title: 'roro tiktok - Comptes',
  description: '',
};

export default async function Page() {
  return <AccountsManager />;
}
