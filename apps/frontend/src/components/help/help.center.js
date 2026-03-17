'use client';
import { useState } from 'react';
const faqs = [
    {
        question: 'Comment connecter mon compte TikTok ?',
        answer: 'Allez dans "Comptes" puis cliquez sur "Ajouter un compte". Sélectionnez TikTok, puis autorisez l\'accès à votre compte via la fenêtre de connexion OAuth.',
    },
    {
        question: 'Comment planifier une vidéo ?',
        answer: 'Rendez-vous dans le "Calendrier" ou "Content Studio", cliquez sur "+ Nouveau Post", uploadez votre vidéo, rédigez la description et choisissez la date/heure de publication.',
    },
    {
        question: 'Comment fonctionne l\'automation ?',
        answer: 'La section "Automation" vous permet de créer des workflows automatisés. Glissez des nœuds (déclencheurs, actions, conditions) sur le canvas pour construire votre workflow visuellement.',
    },
    {
        question: 'Puis-je gérer plusieurs comptes TikTok ?',
        answer: 'Oui ! roro tiktok supporte la gestion multi-comptes. Connectez autant de comptes TikTok que nécessaire depuis le Gestionnaire de Comptes.',
    },
    {
        question: 'Comment voir mes analytics ?',
        answer: 'La page "Analytics" affiche les statistiques de tous vos comptes connectés : vues, likes, commentaires, partages et taux d\'engagement.',
    },
    {
        question: 'L\'inbox affiche-t-il les vrais messages ?',
        answer: 'Actuellement, l\'inbox affiche des données de démonstration. Connectez vos comptes TikTok pour accéder à vos vrais commentaires et messages.',
    },
];
const quickLinks = [
    { label: 'Documentation', url: '#', icon: '📖' },
    { label: 'Guide du développeur', url: '#', icon: '💻' },
    { label: 'API publique', url: '#', icon: '🔗' },
    { label: 'Signaler un bug', url: '#', icon: '🐛' },
];
const FaqAccordion = ({ item, isOpen, onToggle, }) => {
    return (<div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
        <span className="text-sm font-medium text-white">{item.question}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {isOpen && (<div className="px-5 pb-4">
          <p className="text-sm text-white/50 leading-relaxed">{item.answer}</p>
        </div>)}
    </div>);
};
export const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);
    return (<div className="bg-newBgColorInner flex-1 flex-col flex p-6 gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Centre d&apos;aide</h1>
        <p className="text-white/40 text-sm mt-1">
          Trouvez des réponses à vos questions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">Questions fréquentes</h2>
          {faqs.map((faq, i) => (<FaqAccordion key={i} item={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)}/>))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick Links */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Liens rapides</h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (<a key={link.label} href={link.url} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-sm">{link.label}</span>
                </a>))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#161b22] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Besoin d&apos;aide ?</h3>
            <p className="text-xs text-white/40 mb-4">
              Notre équipe est disponible pour vous aider.
            </p>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-[#E8243C] to-[#00D4AA] text-white text-sm font-medium rounded-xl hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>);
};
//# sourceMappingURL=help.center.js.map