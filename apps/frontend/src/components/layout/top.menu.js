'use client';
import { useUser } from "./user.context";
import { useVariables } from "../../../../../libraries/react-shared-libraries/src/helpers/variable.context";
import { MenuItem } from "../new-layout/menu-item";
export const useMenuItem = () => {
    const { isGeneral } = useVariables();
    const firstMenu = [
        {
            name: 'Dashboard',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1"/>
          <rect x="14" y="3" width="7" height="5" rx="1"/>
          <rect x="14" y="12" width="7" height="9" rx="1"/>
          <rect x="3" y="16" width="7" height="5" rx="1"/>
        </svg>),
            path: '/dashboard',
        },
        {
            name: 'Comptes',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>),
            path: '/accounts',
        },
        {
            name: 'Calendrier',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>),
            path: '/launches',
        },
        {
            name: 'Content Studio',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>),
            path: '/content-studio',
        },
        {
            name: 'Automation',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
        </svg>),
            path: '/automation',
        },
        {
            name: 'Inbox',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>),
            path: '/inbox',
        },
        {
            name: 'Média',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
          <line x1="17" y1="17" x2="22" y2="17"/>
        </svg>),
            path: '/media',
        },
    ];
    const secondMenu = [
        {
            name: 'Paramètres',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>),
            path: '/settings',
            role: ['ADMIN', 'USER', 'SUPERADMIN'],
        },
        {
            name: 'Facturation',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>),
            path: '/billing',
            role: ['ADMIN', 'SUPERADMIN'],
            requireBilling: true,
        },
        {
            name: 'Aide',
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>),
            path: '/help',
        },
    ];
    return {
        all: [...firstMenu, ...secondMenu],
        firstMenu,
        secondMenu,
    };
};
export const TopMenu = ({ onNavigate }) => {
    const user = useUser();
    const { firstMenu, secondMenu } = useMenuItem();
    const { isGeneral, billingEnabled } = useVariables();
    return (<>
      <div className="flex flex-1 flex-col gap-[12px] blurMe">
        {
        // @ts-ignore
        (user === null || user === void 0 ? void 0 : user.orgId) &&
            // @ts-ignore
            (user.tier !== 'FREE' || !isGeneral || !billingEnabled) &&
            firstMenu
                .filter((f) => {
                if (f.hide) {
                    return false;
                }
                if (f.requireBilling && !billingEnabled) {
                    return false;
                }
                if (f.name === 'Facturation' && (user === null || user === void 0 ? void 0 : user.isLifetime)) {
                    return false;
                }
                if (f.role) {
                    return f.role.includes(user === null || user === void 0 ? void 0 : user.role);
                }
                return true;
            })
                .map((item, index) => (<MenuItem path={item.path} label={item.name} icon={item.icon} key={item.name} onClick={item.onClick} onNavigate={onNavigate}/>))}
      </div>
      <div className="flex flex-col gap-[12px] blurMe">
        {secondMenu
            .filter((f) => {
            if (f.hide) {
                return false;
            }
            if (f.requireBilling && !billingEnabled) {
                return false;
            }
            if (f.name === 'Facturation' && (user === null || user === void 0 ? void 0 : user.isLifetime)) {
                return false;
            }
            if (f.role) {
                return f.role.includes(user === null || user === void 0 ? void 0 : user.role);
            }
            return true;
        })
            .map((item, index) => (<MenuItem path={item.path} label={item.name} icon={item.icon} key={item.name} onClick={item.onClick} onNavigate={onNavigate}/>))}
      </div>
    </>);
};
//# sourceMappingURL=top.menu.js.map