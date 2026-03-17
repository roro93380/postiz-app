import React from 'react';
import Image from 'next/image';

export const LogoTextComponent = () => {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/roro-logo.png"
        alt="Roro TikTok"
        width={40}
        height={40}
        className="object-contain drop-shadow-[0_0_8px_rgba(232,36,60,0.4)]"
      />
      <span className="text-xl font-bold bg-gradient-to-r from-[#E8243C] to-[#00D4FF] bg-clip-text text-transparent">
        Roro TikTok
      </span>
    </div>
  );
};
