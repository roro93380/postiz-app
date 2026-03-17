'use client';
import Image from 'next/image';
export const Logo = () => {
    return (<div className="mt-[6px] flex min-h-[172px] w-full items-center justify-center px-[12px]">
      <Image src="/roro-logo.png" alt="Roro TikTok" width={168} height={168} className="h-[168px] w-[168px] object-contain drop-shadow-[0_0_18px_rgba(232,36,60,0.55)]" priority/>
    </div>);
};
//# sourceMappingURL=logo.js.map