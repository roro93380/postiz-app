'use client';

import { FC, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useRouter } from 'next/navigation';

type AiTab = 'caption' | 'script' | 'ideas' | 'optimize';

const aiTabLabels: Record<AiTab, string> = {
  caption: 'Légende & Hashtags',
  script: 'Script Vidéo',
  ideas: 'Idées Créatives',
  optimize: 'Optimisation Texte',
};

const hashtagSuggestions = [
  { tag: '#fjords', score: 'score élevé' },
  { tag: '#aventure', score: 'score moy.' },
  { tag: '#france_nature', score: 'score...' },
];

const scriptSuggestions = [
  'Découvrez les fjords comme jamais ! #voyage #fjords #...',
  'Découvrez les fjords sins comme jamais ! #voyage #...',
];

export const ContentStudio: FC = () => {
  const fetch = useFetch();
  const router = useRouter();
  const [activeAiTab, setActiveAiTab] = useState<AiTab>('caption');
  const [aiPrompt, setAiPrompt] = useState('');
  const [description, setDescription] = useState('Découvrez les fjords comme jamais ! #voyage #fjords #nature @VoyageurExcep...');
  const [toneValue, setToneValue] = useState(50);
  const [lengthValue, setLengthValue] = useState(50);

  const loadIntegrations = useCallback(async () => {
    return (await (await fetch('/integrations/list')).json()).integrations;
  }, []);

  const { data: integrations } = useSWR('cs-integrations', loadIntegrations, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
  });

  const tiktokAccounts = useMemo(() => {
    if (!integrations) return [];
    return integrations.filter((i: any) => i.providerIdentifier === 'tiktok' || i.identifier === 'tiktok');
  }, [integrations]);

  return (
    <div className="bg-newBgColorInner flex-1 flex flex-col p-6 gap-5">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">Hub de Création Content Studio</h1>

      {/* Main Layout: Left (AI + Preview) + Right (Sidebar) */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* AI Assistant */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-white">Assistant IA de Création</h2>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>Comptes ▾</span>
                  <span>Type de contenu ▾</span>
                </div>
              </div>
            </div>

            {/* AI Prompt */}
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Quel type de contenu l'IA doit-elle générer ou optimiser ?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4AA]/50 mb-4"
            />

            {/* AI Tabs */}
            <div className="flex gap-1 mb-4">
              {(Object.keys(aiTabLabels) as AiTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveAiTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeAiTab === tab
                      ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30'
                      : 'text-white/50 hover:text-white/70 border border-transparent'
                  }`}
                >
                  {aiTabLabels[tab]}
                </button>
              ))}
            </div>
          </div>

          {/* Video Preview + Description */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-3">Aperçu &amp; Montage de Base</h3>

            <div className="flex gap-4 flex-1">
              {/* Video placeholder */}
              <div className="w-[200px] h-[260px] bg-[#0d1117] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20 mx-auto mb-2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <p className="text-[10px] text-white/20">Importer / Modifier la Vidéo</p>
                </div>
                <button className="absolute bottom-2 right-2 w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              </div>

              {/* Right side: account + description */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Account selector */}
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8243C] to-[#00D4AA] flex items-center justify-center text-white text-xs font-bold">
                    {tiktokAccounts?.[0]?.name?.[0] || 'V'}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-white/40">Publier sur :</span>
                    <span className="text-xs text-white font-medium ml-1">
                      @{tiktokAccounts?.[0]?.identifier || 'VoyageurExcep'}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">Importer / Modifier la Vidéo</span>
                </div>

                {/* Description area */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00D4AA]/50 resize-none"
                  placeholder="Rédigez votre légende ici..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">{description.length} caractères</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <button className="px-4 py-2 text-xs text-white/50 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors">
                Enregistrer Brouillon
              </button>
              <button className="px-4 py-2 text-xs text-white bg-gradient-to-r from-[#E8243C] to-[#C41D32] rounded-xl hover:shadow-[0_0_12px_rgba(232,36,60,0.3)] transition-all">
                Optimiser avec l&apos;IA
              </button>
              <button className="px-4 py-2 text-xs text-white bg-[#00D4AA] rounded-xl hover:bg-[#00D4AA]/80 transition-all">
                Planifier
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[280px] flex flex-col gap-4">
          {/* IA Settings */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Paramètres IA &amp; Suggestions</h3>
              <button className="text-white/30 hover:text-white/60 text-lg">···</button>
            </div>

            {/* Tone slider */}
            <div className="mb-4">
              <p className="text-xs text-white/40 mb-2">Optimisation IA</p>
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                <span>Drôle</span>
                <span>Professionnel</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={toneValue}
                onChange={(e) => setToneValue(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00D4AA]"
              />
            </div>

            {/* Length slider */}
            <div className="mb-4">
              <p className="text-xs text-white/40 mb-2">Longueur</p>
              <input
                type="range"
                min="0"
                max="100"
                value={lengthValue}
                onChange={(e) => setLengthValue(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00D4AA]"
              />
            </div>

            {/* Objectives */}
            <div className="mb-4">
              <p className="text-xs text-white/40 mb-2">Objectifs</p>
              <div className="flex gap-1">
                <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-white/50">Engagement</span>
                <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg text-white/50">Croissance</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] text-white text-sm font-medium rounded-xl hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all">
              Générer avec l&apos;IA
            </button>
          </div>

          {/* Hashtag Suggestions */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Suggestions de Hashtags</h3>
              <button className="text-white/30 hover:text-white/60 text-lg">···</button>
            </div>
            <div className="flex flex-col gap-2">
              {hashtagSuggestions.map((h) => (
                <div key={h.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#00D4AA]">{h.tag}</span>
                    <span className="text-[10px] text-white/30">({h.score})</span>
                  </div>
                  <button className="text-[10px] text-[#00D4AA] hover:text-[#00D4AA]/80 font-medium">Ajouter</button>
                </div>
              ))}
            </div>
          </div>

          {/* Scripts & Ideas */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Scripts &amp; Idées IA</h3>
              <button className="text-white/30 hover:text-white/60 text-lg">···</button>
            </div>
            <div className="flex flex-col gap-2">
              {scriptSuggestions.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-2 text-xs text-white/50 cursor-pointer hover:text-white/70 hover:bg-white/10 transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
