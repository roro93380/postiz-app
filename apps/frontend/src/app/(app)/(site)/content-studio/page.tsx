export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { ContentStudio } from '@gitroom/frontend/components/content-studio/content.studio';

export const metadata: Metadata = {
  title: 'roro tiktok - Content Studio',
  description: '',
};

export default async function Page() {
  return <ContentStudio />;
}
