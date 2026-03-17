'use client';
import { __awaiter } from "tslib";
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from "../../../../../libraries/helpers/src/utils/custom.fetch";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const AccountCard = ({ account, selected, onSelect }) => {
    var _a, _b;
    const isTikTok = account.providerIdentifier === 'tiktok';
    const isActive = !account.disabled;
    return (<button onClick={onSelect} className={`bg-[#161b22] border rounded-2xl p-4 text-left transition-all duration-300 group w-full ${selected ? 'border-[#00D4AA]/50 ring-1 ring-[#00D4AA]/20' : 'border-white/10 hover:border-white/20'}`}>
      {/* Profile + video thumbnails area */}
      <div className="flex items-center gap-3 mb-3">
        {account.picture ? (<Image src={account.picture} alt="" width={48} height={48} className="rounded-full ring-2 ring-white/10 group-hover:ring-[#00D4AA]/30 transition-all"/>) : (<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8243C] to-[#00D4AA] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {((_b = (_a = account.identifier) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || '?'}
          </div>)}
        {/* Mini video thumbnails */}
        <div className="flex gap-1 flex-1">
          {[1, 2, 3].map((i) => (<div key={i} className="w-8 h-10 rounded bg-white/5 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/15">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>))}
        </div>
      </div>

      {/* Username */}
      <p className="text-sm text-white font-medium mb-0.5">{account.name || account.identifier}</p>
      <p className="text-xs text-white/40 mb-3">@{account.identifier}</p>

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isActive
            ? 'text-[#32d583] bg-[#32d583]/10'
            : 'text-[#f97066] bg-[#f97066]/10'}`}>
          {isActive ? 'Actif' : 'Vérification nécessaire'}
        </span>
        {isTikTok && (<span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4AA]/10 text-[#00D4AA] font-medium">
            TikTok
          </span>)}
      </div>

      {/* Stats */}
      <div className="flex gap-4 pt-2 border-t border-white/5">
        <div>
          <p className="text-xs text-white font-semibold">12.4K</p>
          <p className="text-[10px] text-white/30">Followers</p>
        </div>
        <div>
          <p className="text-xs text-white font-semibold">1.2M</p>
          <p className="text-[10px] text-white/30">Vues récentes</p>
        </div>
      </div>
    </button>);
};
export const AccountsManager = () => {
    var _a, _b;
    const fetch = useFetch();
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(null);
    const loadIntegrations = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        return (yield (yield fetch('/integrations/list')).json()).integrations;
    }), []);
    const { data: integrations } = useSWR('accounts-integrations', loadIntegrations, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateOnMount: true,
    });
    const filtered = useMemo(() => {
        if (!integrations)
            return [];
        if (filter === 'tiktok') {
            return integrations.filter((i) => i.providerIdentifier === 'tiktok');
        }
        return integrations;
    }, [integrations, filter]);
    const tiktokCount = useMemo(() => (integrations === null || integrations === void 0 ? void 0 : integrations.filter((i) => i.providerIdentifier === 'tiktok').length) || 0, [integrations]);
    const selectedAccount = useMemo(() => (integrations === null || integrations === void 0 ? void 0 : integrations.find((i) => i.id === selectedId)) || null, [integrations, selectedId]);
    return (<div className="bg-newBgColorInner flex-1 flex flex-col p-6 gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestionnaire de Comptes</h1>
          <p className="text-white/40 text-sm mt-1">
            {(integrations === null || integrations === void 0 ? void 0 : integrations.length) || 0} comptes connectés dont {tiktokCount} TikTok
          </p>
        </div>
      </div>

      {/* Connect Button - centered */}
      <div className="flex justify-center">
        <button onClick={() => router.push('/integrations/social')} className="px-6 py-3 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all">
          Connecter un nouveau Compte TikTok
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all'
            ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30'
            : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'}`}>
          Tous les comptes
        </button>
        <button onClick={() => setFilter('tiktok')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'tiktok'
            ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30'
            : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'}`}>
          TikTok uniquement
        </button>
      </div>

      {/* Main: Grid + Detail Sidebar */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Grid */}
        <div className="flex-1">
          {filtered && filtered.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((account) => (<AccountCard key={account.id} account={account} selected={selectedId === account.id} onSelect={() => setSelectedId(account.id)}/>))}
            </div>) : (<div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <path d="M20 8v6M23 11h-6"/>
                  </svg>
                </div>
                <p className="text-white/40 text-sm">Aucun compte connecté</p>
                <button onClick={() => router.push('/integrations/social')} className="mt-3 text-[#00D4AA] text-sm hover:underline">
                  Connecter un compte →
                </button>
              </div>
            </div>)}
        </div>

        {/* Detail Sidebar */}
        {selectedAccount && (<div className="w-[280px] bg-[#161b22] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              {selectedAccount.picture ? (<Image src={selectedAccount.picture} alt="" width={64} height={64} className="rounded-full ring-2 ring-[#00D4AA]/30 mb-3"/>) : (<div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8243C] to-[#00D4AA] flex items-center justify-center text-white font-bold text-xl mb-3">
                  {((_b = (_a = selectedAccount.identifier) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || '?'}
                </div>)}
              <p className="text-sm text-white font-semibold">{selectedAccount.name || selectedAccount.identifier}</p>
              <p className="text-xs text-white/40">@{selectedAccount.identifier}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-sm text-white font-bold">12.4K</p>
                <p className="text-[10px] text-white/30">Followers</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-sm text-white font-bold">1.2M</p>
                <p className="text-[10px] text-white/30">Vues</p>
              </div>
            </div>

            {/* API Status */}
            <div className="pt-3 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Statut API Global</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#32d583]"/>
                <span className="text-xs text-[#32d583]">Connecté</span>
              </div>
            </div>

            {/* Status badge */}
            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium text-center ${selectedAccount.disabled
                ? 'text-[#f97066] bg-[#f97066]/10'
                : 'text-[#32d583] bg-[#32d583]/10'}`}>
              {selectedAccount.disabled ? 'Vérification nécessaire' : 'Actif'}
            </span>
          </div>)}
      </div>
    </div>);
};
//# sourceMappingURL=accounts.manager.js.map