'use client';

import { FC, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ── Sparkline SVG (mini 7-point trend) ────────────────────────────── */
const Sparkline: FC<{ color: string; points?: number[] }> = ({
  color,
  points = [20, 45, 30, 60, 35, 55, 70],
}) => {
  const w = 80,
    h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <polyline
        points={coords}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ── Stat Card ─────────────────────────────────────────────────────── */
const StatCard: FC<{
  label: string;
  value: string | number;
  change?: number;
  sparkColor: string;
  sparkPoints?: number[];
}> = ({ label, value, change, sparkColor, sparkPoints }) => (
  <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
    <div className="flex items-start justify-between mb-3">
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
      {change !== undefined && change !== 0 && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            change > 0 ? 'text-[#32d583] bg-[#32d583]/10' : 'text-[#f97066] bg-[#f97066]/10'
          }`}
        >
          {change > 0 ? '+' : ''}
          {change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-white tracking-tight mb-2">{value}</p>
    <Sparkline color={sparkColor} points={sparkPoints} />
  </div>
);

/* ── Day labels for calendar ───────────────────────────────────────── */
const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/* ── Post Item ─────────────────────────────────────────────────────── */
interface PostItem {
  id: string;
  content: string;
  publishDate: string;
  state: string;
  integration?: { name: string; identifier: string; picture?: string };
}

const stateLabels: Record<string, string> = {
  PUBLISHED: 'Publié',
  QUEUE: 'En file',
  DRAFT: 'Brouillon',
  ERROR: 'Échoué',
  SCHEDULED: 'Planifié',
};
const stateColors: Record<string, string> = {
  PUBLISHED: 'text-[#32d583] bg-[#32d583]/10',
  QUEUE: 'text-[#00D4AA] bg-[#00D4AA]/10',
  DRAFT: 'text-white/40 bg-white/5',
  ERROR: 'text-[#f97066] bg-[#f97066]/10',
  SCHEDULED: 'text-[#F4A261] bg-[#F4A261]/10',
};

/* ── Main Component ────────────────────────────────────────────────── */
export const DashboardComponent: FC = () => {
  const fetch = useFetch();
  const user = useUser();
  const router = useRouter();

  const loadChannels = useCallback(async () => {
    return (await (await fetch('/integrations/list')).json()).integrations;
  }, []);

  const { data: channels } = useSWR('dashboard-channels', loadChannels, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
  });

  const loadRecentPosts = useCallback(async () => {
    return (await fetch('/posts/list?page=0&limit=5')).json();
  }, []);

  const { data: recentPostsData } = useSWR('dashboard-recent-posts', loadRecentPosts, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
  });

  const recentPosts: PostItem[] = useMemo(() => {
    if (!recentPostsData?.posts) return [];
    return recentPostsData.posts.slice(0, 5).map((p: any) => ({
      id: p.id,
      content: p.content || '',
      publishDate: p.publishDate,
      state: p.state,
      integration: p.integration,
    }));
  }, [recentPostsData]);

  const channelCount = channels?.length || 0;
  const totalPosts = recentPostsData?.total || 0;

  const publishedCount = useMemo(() => {
    if (!recentPostsData?.posts) return 0;
    return recentPostsData.posts.filter((p: any) => p.state === 'PUBLISHED').length;
  }, [recentPostsData]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting},{' '}
          <span className="bg-gradient-to-r from-[#E8243C] to-[#00D4AA] bg-clip-text text-transparent">
            {user?.fullname || 'there'}
          </span>
        </h1>
        <p className="text-white/40 mt-1 text-sm">Voici un aperçu de vos réseaux sociaux</p>
      </div>

      {/* GLOBAL PERFORMANCE */}
      <div>
        <h2 className="text-xs text-white/30 uppercase tracking-widest font-bold mb-4">
          Global Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Views"
            value="12.5M"
            change={15}
            sparkColor="#00D4AA"
            sparkPoints={[30, 45, 38, 55, 48, 65, 70]}
          />
          <StatCard
            label="Total Followers"
            value={channelCount > 0 ? '8.2M' : '0'}
            change={8}
            sparkColor="#E8243C"
            sparkPoints={[25, 32, 40, 38, 50, 48, 55]}
          />
          <StatCard
            label="Avg Engagement"
            value="4.8%"
            change={2}
            sparkColor="#F4A261"
            sparkPoints={[20, 28, 35, 30, 42, 38, 45]}
          />
          <StatCard
            label="Total Publications"
            value={totalPosts}
            change={publishedCount > 0 ? 12 : undefined}
            sparkColor="#00D4AA"
            sparkPoints={[15, 30, 25, 45, 40, 50, 55]}
          />
        </div>
      </div>

      {/* Middle Row: Calendar Sync + Last Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Sync */}
        <div className="lg:col-span-2 bg-[#161b22] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Calendar Sync
            </h2>
            <button
              onClick={() => router.push('/launches')}
              className="text-[10px] text-[#00D4AA] hover:text-[#00D4AA]/80 transition-colors"
            >
              Voir le calendrier →
            </button>
          </div>
          {/* Week mini-view */}
          <div className="grid grid-cols-7 gap-2">
            {dayLabels.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-white/30 font-medium">{day}</span>
                <div
                  className={`w-full aspect-square rounded-xl border flex items-center justify-center ${
                    i === 2
                      ? 'border-[#00D4AA]/40 bg-[#00D4AA]/5'
                      : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  {(i === 0 || i === 2 || i === 4) && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        i === 2 ? 'bg-[#00D4AA]' : 'bg-[#E8243C]/60'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Posts */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Last Posts
            </h2>
            <button className="text-white/30 hover:text-white/60 text-lg">···</button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {post.integration?.picture ? (
                      <Image src={post.integration.picture} alt="" width={40} height={40} className="object-cover" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">
                      {post.content?.substring(0, 40) || 'Sans titre'}
                    </p>
                    <p className="text-[10px] text-white/30">
                      @{post.integration?.identifier || 'inconnu'}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      stateColors[post.state] || 'text-white/40 bg-white/5'
                    }`}
                  >
                    {stateLabels[post.state] || post.state}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-white/30">Aucune publication récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations Banner */}
      <div className="relative bg-[#161b22] border border-white/10 rounded-2xl p-5 overflow-hidden">
        {/* Gradient glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4AA]/5 via-transparent to-[#E8243C]/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00D4AA]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#E8243C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] rounded text-white font-bold">IA</span>
              <h2 className="text-xs text-white/30 uppercase tracking-widest font-bold">
                AI Recommendations
              </h2>
            </div>
            <p className="text-sm text-white/70 max-w-lg">
              Postez entre 18h et 20h pour maximiser l&apos;engagement. Vos vidéos courtes (&lt;30s) performent 2.3x mieux.
              Utilisez les hashtags tendance #voyage #nature pour atteindre de nouvelles audiences.
            </p>
          </div>
          <button
            onClick={() => router.push('/content-studio')}
            className="px-4 py-2 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] text-white text-sm font-medium rounded-xl hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all flex-shrink-0"
          >
            Créer du contenu →
          </button>
        </div>
      </div>
    </div>
  );
};
