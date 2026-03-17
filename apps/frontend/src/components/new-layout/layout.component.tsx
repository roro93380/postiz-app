'use client';

import React, { ReactNode, useCallback, useState } from 'react';
import { Logo } from '@gitroom/frontend/components/new-layout/logo';
import { Plus_Jakarta_Sans } from 'next/font/google';
const ModeComponent = dynamic(
  () => import('@gitroom/frontend/components/layout/mode.component'),
  {
    ssr: false,
  }
);

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { CheckPayment } from '@gitroom/frontend/components/layout/check.payment';
import { ToolTip } from '@gitroom/frontend/components/layout/top.tip';
import { ShowMediaBoxModal } from '@gitroom/frontend/components/media/media.component';
import { ShowLinkedinCompany } from '@gitroom/frontend/components/launches/helpers/linkedin.component';
import { MediaSettingsLayout } from '@gitroom/frontend/components/launches/helpers/media.settings.component';
import { Toaster } from '@gitroom/react/toaster/toaster';
import { ShowPostSelector } from '@gitroom/frontend/components/post-url-selector/post.url.selector';
import { NewSubscription } from '@gitroom/frontend/components/layout/new.subscription';
import { Support } from '@gitroom/frontend/components/layout/support';
import { ContinueProvider } from '@gitroom/frontend/components/layout/continue.provider';
import { ContextWrapper } from '@gitroom/frontend/components/layout/user.context';
import { CopilotKit } from '@copilotkit/react-core';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { Impersonate } from '@gitroom/frontend/components/layout/impersonate';
import { Title } from '@gitroom/frontend/components/layout/title';
import { TopMenu } from '@gitroom/frontend/components/layout/top.menu';
import { LanguageComponent } from '@gitroom/frontend/components/layout/language.component';
import { ChromeExtensionComponent } from '@gitroom/frontend/components/layout/chrome.extension.component';
import NotificationComponent from '@gitroom/frontend/components/notifications/notification.component';
import { OrganizationSelector } from '@gitroom/frontend/components/layout/organization.selector';
import { StreakComponent } from '@gitroom/frontend/components/layout/streak.component';
import { PreConditionComponent } from '@gitroom/frontend/components/layout/pre-condition.component';
import { AttachToFeedbackIcon } from '@gitroom/frontend/components/new-layout/sentry.feedback.component';
import { FirstBillingComponent } from '@gitroom/frontend/components/billing/first.billing.component';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['600', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export const LayoutComponent = ({ children }: { children: ReactNode }) => {
  const fetch = useFetch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { backendUrl, billingEnabled, isGeneral } = useVariables();

  // Feedback icon component attaches Sentry feedback to a top-bar icon when DSN is present
  const searchParams = useSearchParams();
  const load = useCallback(async (path: string) => {
    return await (await fetch(path)).json();
  }, []);
  const { data: user, mutate } = useSWR('/user/self', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });

  if (!user) return null;

  return (
    <ContextWrapper user={user}>
      <CopilotKit
        credentials="include"
        runtimeUrl={backendUrl + '/copilot/chat'}
        showDevConsole={false}
      >
        <MantineWrapper>
          <ToolTip />
          <Toaster />
          <CheckPayment check={searchParams.get('check') || ''} mutate={mutate}>
            <ShowMediaBoxModal />
            <ShowLinkedinCompany />
            <MediaSettingsLayout />
            <ShowPostSelector />
            <PreConditionComponent />
            <NewSubscription />
            <ContinueProvider />
            <div
              className={clsx(
                'flex flex-col min-h-screen min-w-screen text-newTextColor p-[12px] pt-[15px]',
                jakartaSans.className
              )}
            >
              <div>{user?.admin ? <Impersonate /> : <div />}</div>
              {user.tier === 'FREE' && isGeneral && billingEnabled ? (
                <FirstBillingComponent />
              ) : (
                <div className="flex-1 flex gap-[8px]">
                  <Support />
                  {mobileMenuOpen && (
                    <button
                      type="button"
                      aria-label="Fermer le menu"
                      className="fixed inset-0 z-30 bg-black/55 lg:hidden"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  )}
                  <div
                    className={clsx(
                      'fixed inset-y-[12px] left-[12px] z-40 flex w-[280px] flex-col rounded-[20px] bg-[#0d1117] p-[14px] shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 lg:sticky lg:top-[12px] lg:z-auto lg:h-[calc(100vh-24px)] lg:w-[240px] lg:min-w-[240px] lg:translate-x-0',
                      mobileMenuOpen ? 'translate-x-0' : '-translate-x-[115%]'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex h-full flex-1 flex-col overflow-hidden rounded-[16px] bg-[#0d1117]',
                        user?.admin && 'pt-[60px]'
                      )}
                    >
                      <div className="flex h-full flex-col gap-[24px] flex-1 py-[8px]">
                        <Logo />
                        <div className="flex-1 overflow-y-auto px-[4px]">
                          <TopMenu onNavigate={() => setMobileMenuOpen(false)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-newBgLineColor rounded-[12px] overflow-hidden flex flex-col gap-[1px] blurMe">
                    <div className="flex bg-newBgColorInner/80 backdrop-blur-xl min-h-[80px] px-[16px] lg:px-[20px] items-center border-b-2 border-b-transparent gap-[14px]" style={{borderImage: 'linear-gradient(90deg, #E8243C, #00D4AA) 1'}}>
                      <button
                        type="button"
                        aria-label="Ouvrir le menu"
                        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/5 text-white lg:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                      </button>
                      <div className="text-[20px] lg:text-[24px] font-[600] flex flex-1 min-w-0">
                        <Title />
                      </div>
                      <div className="hidden md:flex gap-[20px] text-textItemBlur">
                        <StreakComponent />
                        <div className="w-[1px] h-[20px] bg-blockSeparator" />
                        <OrganizationSelector />
                        <div className="hover:text-newTextColor">
                          <ModeComponent />
                        </div>
                        <div className="w-[1px] h-[20px] bg-blockSeparator" />
                        <LanguageComponent />
                        <ChromeExtensionComponent />
                        <div className="w-[1px] h-[20px] bg-blockSeparator" />
                        <AttachToFeedbackIcon />
                        <NotificationComponent />
                      </div>
                      <div className="flex md:hidden gap-[12px] text-textItemBlur">
                        <div className="hover:text-newTextColor">
                          <ModeComponent />
                        </div>
                        <NotificationComponent />
                      </div>
                    </div>
                    <div className="flex flex-1 gap-[1px]">{children}</div>
                  </div>
                </div>
              )}
            </div>
          </CheckPayment>
        </MantineWrapper>
      </CopilotKit>
    </ContextWrapper>
  );
};
