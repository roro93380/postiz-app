'use client';
import { useState, useCallback } from 'react';
const defaultRules = [
    { id: '1', name: 'Auto-Réponse Commentaires IA', description: 'Répond automatiquement aux commentaires fréquents avec l\'IA', active: true, hasAi: true },
    { id: '2', name: 'Reposter si Viral', description: 'Reporte le contenu si > 10K vues en 24h', active: true, hasAi: false },
    { id: '3', name: 'Planification Smart IA', description: 'Planifie les posts aux heures optimales déterminées par l\'IA', active: false, hasAi: true },
    { id: '4', name: 'Cross-post TikTok → Instagram', description: 'Publie sur Instagram quand une vidéo est postée sur TikTok', active: true, hasAi: false },
];
export const AutomationBuilder = () => {
    const [rules, setRules] = useState(defaultRules);
    const [selectedRule, setSelectedRule] = useState('1');
    const handleToggle = useCallback((id) => {
        setRules((prev) => prev.map((r) => (r.id === id ? Object.assign(Object.assign({}, r), { active: !r.active }) : r)));
    }, []);
    return (<div className="bg-newBgColorInner flex-1 flex-col flex p-6 gap-5">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">Générateur de Règles d&apos;Automatisation</h1>

      {/* Split Layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left: Rules List */}
        <div className="w-[320px] bg-[#161b22] border border-white/10 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Liste des Règles</h2>
            <button className="text-white/30 hover:text-white/60 text-lg">···</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {rules.map((rule) => (<button key={rule.id} onClick={() => setSelectedRule(rule.id)} className={`w-full text-left rounded-xl p-3 transition-all border ${selectedRule === rule.id
                ? 'bg-white/5 border-[#00D4AA]/30'
                : 'border-transparent hover:bg-white/5'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-white font-medium truncate">{rule.name}</span>
                    {rule.hasAi && (<span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] rounded text-white font-bold flex-shrink-0">
                        IA
                      </span>)}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle */}
                    <div onClick={(e) => { e.stopPropagation(); handleToggle(rule.id); }} className={`w-8 h-4 rounded-full transition-all relative cursor-pointer ${rule.active ? 'bg-[#00D4AA]' : 'bg-white/20'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${rule.active ? 'left-4' : 'left-0.5'}`}/>
                    </div>
                    {/* Edit */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 hover:text-white/60 cursor-pointer">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    {/* Delete */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 hover:text-[#E8243C] cursor-pointer">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">{rule.description}</p>
              </button>))}
          </div>

          {/* Bottom: Account Filters */}
          <div className="p-3 border-t border-white/5">
            <p className="text-[10px] text-white/30 mb-2 uppercase tracking-wider">Filtres Comptes</p>
            <div className="flex gap-1">
              <span className="text-[10px] px-2 py-1 bg-[#00D4AA]/10 text-[#00D4AA] rounded-lg">Tous</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 text-white/40 rounded-lg cursor-pointer hover:text-white/60">@VoyageurExcep</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 text-white/40 rounded-lg cursor-pointer hover:text-white/60">@ChefMichel</span>
            </div>
          </div>
        </div>

        {/* Right: Visual Flow Editor */}
        <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col">
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auto-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auto-grid)"/>
          </svg>

          {/* Flow Nodes */}
          <div className="flex-1 flex items-center justify-center gap-0 relative z-10 px-8">
            {/* Trigger Node */}
            <div className="flex flex-col items-center">
              <div className="bg-[#E8243C]/10 border border-[#E8243C]/30 rounded-xl p-4 w-[160px] text-center">
                <div className="w-8 h-8 rounded-full bg-[#E8243C]/20 flex items-center justify-center mx-auto mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8243C" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <p className="text-xs text-white font-medium">Déclencheur</p>
                <p className="text-[10px] text-white/40 mt-1">Nouveau Commentaire</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="w-16 flex items-center justify-center">
              <div className="w-full h-[2px] bg-gradient-to-r from-[#E8243C]/50 to-[#F4A261]/50 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-[#F4A261]/50 border-y-[4px] border-y-transparent"/>
              </div>
            </div>

            {/* Condition Node (diamond shape via rotate) */}
            <div className="flex flex-col items-center">
              <div className="bg-[#F4A261]/10 border border-[#F4A261]/30 rounded-lg p-4 w-[140px] rotate-0 text-center relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F4A261]/20 rounded rotate-45 border border-[#F4A261]/30"/>
                <div className="w-8 h-8 rounded-full bg-[#F4A261]/20 flex items-center justify-center mx-auto mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <p className="text-xs text-white font-medium">Condition</p>
                <p className="text-[10px] text-white/40 mt-1">Analyse Sentiment IA</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="w-16 flex items-center justify-center">
              <div className="w-full h-[2px] bg-gradient-to-r from-[#F4A261]/50 to-[#00D4AA]/50 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-[#00D4AA]/50 border-y-[4px] border-y-transparent"/>
              </div>
            </div>

            {/* Action Node */}
            <div className="flex flex-col items-center">
              <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-xl p-4 w-[160px] text-center relative">
                <span className="absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] rounded text-white font-bold">IA</span>
                <div className="w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mx-auto mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
                <p className="text-xs text-white font-medium">Action</p>
                <p className="text-[10px] text-white/40 mt-1">Réponse Auto IA</p>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="relative z-10 flex items-center justify-between p-4 border-t border-white/5">
            <button className="px-4 py-2 text-xs text-white bg-gradient-to-r from-[#E8243C] to-[#C41D32] rounded-xl hover:shadow-[0_0_12px_rgba(232,36,60,0.3)] transition-all">
              Créer une Nouvelle Règle
            </button>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs text-white bg-[#E8243C] rounded-xl hover:bg-[#E8243C]/80 transition-all">
                Enregistrer Règle
              </button>
              <button className="px-4 py-2 text-xs text-white bg-[#00D4AA] rounded-xl hover:bg-[#00D4AA]/80 transition-all">
                Tester avec l&apos;IA
              </button>
              <button className="px-4 py-2 text-xs text-white/50 bg-white/5 rounded-xl border border-white/10 hover:text-white/70 transition-all">
                &gt; Content Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
//# sourceMappingURL=automation.builder.js.map