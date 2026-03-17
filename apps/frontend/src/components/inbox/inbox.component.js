'use client';
import { useState, useMemo } from 'react';
const mockMessages = [
    {
        id: '1',
        sender: 'FanFjord',
        handle: '@VoyageurExcep',
        avatar: 'F',
        platform: 'tiktok',
        content: 'C\'est magnifique ! Comment faire pour réserver ?',
        context: 'Comment on "Explore les fjords"',
        time: '19 min',
        unread: true,
        type: 'comment',
    },
    {
        id: '2',
        sender: 'FanFjord',
        handle: '@VoyageurExcep',
        avatar: 'F',
        platform: 'tiktok',
        content: 'Ne a rait commentarier comment faire pour réserver ?!',
        context: 'Comment on "Explore les fjords"',
        time: '17 min',
        unread: true,
        type: 'comment',
    },
    {
        id: '3',
        sender: 'GourmetPro',
        handle: '@ChefDuCuiz',
        avatar: 'G',
        platform: 'tiktok',
        content: 'Hey, on pourrait faire une collab ?',
        context: 'DM',
        time: '17 min',
        unread: false,
        type: 'dm',
    },
    {
        id: '4',
        sender: 'GourmetPro',
        handle: '@ChefDuCuiz',
        avatar: 'G',
        platform: 'tiktok',
        content: 'Messageur ! Comment faire pour r...',
        context: 'Comment on "Recette pâtes"',
        time: '13 min',
        unread: false,
        type: 'comment',
    },
    {
        id: '5',
        sender: 'DroneLover',
        handle: '@TechReviewFR',
        avatar: 'D',
        platform: 'tiktok',
        content: 'GG la vidéo ! Le montage est incroyable',
        context: 'Comment on "Test drone"',
        time: '13 min',
        unread: false,
        type: 'comment',
    },
    {
        id: '6',
        sender: 'DroneLover',
        handle: '@TechDuCuiz',
        avatar: 'D',
        platform: 'tiktok',
        content: 'Salut ! Tu as reçu le drone pour le test ?',
        context: 'Comment on "Test drone"',
        time: '19 min',
        unread: false,
        type: 'comment',
    },
];
const aiSuggestions = [
    { tone: 'Amical', text: '(scomple prompts saper trier core élevé...)', color: 'bg-[#32d583]' },
    { tone: 'Drôle', text: '(scomple prompts vaper trier iones en oron...', color: 'bg-[#F4A261]' },
    { tone: 'Professionnel', text: '(scorple prompts atos comments...', color: 'bg-[#00D4AA]' },
    { tone: 'Professionnel', text: '(scomple prompts vous comment...', color: 'bg-[#00D4AA]' },
];
const filterLabels = {
    all: 'Tous',
    comment: 'Commentaires',
    dm: 'Messages Directs',
};
export const InboxComponent = () => {
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(mockMessages[0].id);
    const [replyText, setReplyText] = useState('');
    const filtered = useMemo(() => {
        if (filter === 'all')
            return mockMessages;
        return mockMessages.filter((m) => m.type === filter);
    }, [filter]);
    const selected = useMemo(() => mockMessages.find((m) => m.id === selectedId) || null, [selectedId]);
    const unreadCount = useMemo(() => mockMessages.filter((m) => m.unread).length, []);
    return (<div className="bg-newBgColorInner flex-1 flex flex-col p-6 gap-5">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">Boîte de Réception Unifiée</h1>

      {/* Main Split View */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left: Messages List */}
        <div className="w-[380px] bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {/* List Header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Messages &amp; Commentaires</h2>
              <button className="text-white/30 hover:text-white/60 text-lg">···</button>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-1">
              {Object.keys(filterLabels).map((f) => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f
                ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30'
                : 'text-white/50 hover:text-white/70 border border-transparent'}`}>
                  {filterLabels[f]}
                </button>))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((msg) => (<button key={msg.id} onClick={() => setSelectedId(msg.id)} className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${selectedId === msg.id ? 'bg-[#00D4AA]/5 border-l-2 border-l-[#00D4AA]' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8243C] to-[#00D4AA] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-white">{msg.sender}</span>
                        <span className="text-[10px] text-white/30 ml-2">{msg.time}</span>
                      </div>
                      {msg.unread && (<span className="w-2 h-2 rounded-full bg-[#00D4AA] flex-shrink-0"/>)}
                    </div>
                    <p className="text-[10px] text-white/40">{msg.handle}</p>
                    <p className="text-xs text-white/50 truncate">{msg.context}</p>
                  </div>
                </div>
              </button>))}
          </div>

          {/* Filters / Accounts */}
          <div className="p-3 border-t border-white/5">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Filtres</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#E8243C]"/>
                @VoyageurExcep
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#00D4AA]"/>
                @ChefDuCuiz
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#F4A261]"/>
                @TechReviewFR
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail + AI */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Conversation Detail */}
          <div className="flex-1 bg-[#161b22] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
            {selected ? (<>
                {/* Detail Header */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8243C] to-[#00D4AA] flex items-center justify-center text-white font-bold">
                      {selected.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-sm">{selected.sender}</h3>
                        <span className="text-xs text-white/30">{selected.handle}</span>
                      </div>
                      <p className="text-xs text-white/40">{selected.context}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      </div>
                      <button className="text-white/30 hover:text-white/60 text-lg">···</button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  <div className="bg-white/5 rounded-xl p-3 max-w-[80%]">
                    <p className="text-sm text-white/80">{selected.content}</p>
                  </div>
                </div>

                {/* Reply Area */}
                <div className="p-4 border-t border-white/5">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="C'est magnifique ! Comment faire pour réserver ? Ne a rait commentarier comment faire pour réserver ?!" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00D4AA]/50 resize-none h-[60px]"/>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/30">{replyText.length} car.</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded-lg border border-white/10 transition-colors">
                        Enregistrer Brouillon
                      </button>
                      <button className="px-3 py-1.5 text-xs text-white bg-gradient-to-r from-[#E8243C] to-[#C41D32] rounded-lg hover:shadow-[0_0_12px_rgba(232,36,60,0.3)] transition-all">
                        Générer une Réponse
                      </button>
                      <button className="px-3 py-1.5 text-xs text-white bg-[#00D4AA] rounded-lg hover:bg-[#00D4AA]/80 transition-all">
                        Publier la Réponse
                      </button>
                    </div>
                  </div>
                </div>
              </>) : (<div className="flex-1 flex items-center justify-center">
                <p className="text-white/30 text-sm">Sélectionnez un message</p>
              </div>)}
          </div>

          {/* AI Response Assistant */}
          <div className="bg-[#161b22] border border-[#00D4AA]/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,212,170,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">✨</span>
                <h3 className="text-sm font-semibold text-white">Assistant IA de Réponse</h3>
              </div>
              <button className="text-white/30 hover:text-white/60 text-lg">···</button>
            </div>
            <p className="text-xs text-white/40 mb-3">Suggestions de Réponse IA</p>
            <div className="flex flex-col gap-2">
              {aiSuggestions.map((s, i) => (<div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${s.color} flex-shrink-0`}/>
                    <span className="text-xs text-white/70 font-medium">{s.tone}</span>
                    <span className="text-[10px] text-white/30 truncate">{s.text}</span>
                  </div>
                  <button className="text-[10px] text-[#00D4AA] hover:text-[#00D4AA]/80 font-medium ml-2 flex-shrink-0">
                    Appliquer
                  </button>
                </div>))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-white/20 text-center">
        💡 Données de démonstration — Connectez vos comptes TikTok pour voir vos vrais messages
      </p>
    </div>);
};
//# sourceMappingURL=inbox.component.js.map