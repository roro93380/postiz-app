'use client';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

export const MenuItem: FC<{
  label: string;
  icon: ReactNode;
  path: string;
  onClick?: () => void;
  onNavigate?: () => void;
}> = ({ label, icon, path, onClick, onNavigate }) => {
  const currentPath = usePathname();
  const isActive = currentPath.indexOf(path) === 0;

  const className = clsx(
    'flex w-full items-center gap-[12px] rounded-[14px] px-[16px] py-[12px] text-left text-[14px] font-[600] transition-all duration-200 ease-out',
    isActive
      ? 'text-white bg-gradient-to-br from-[#E8243C] to-[#00D4FF] shadow-lg shadow-[#E8243C]/30'
      : 'text-gray-400 hover:text-white hover:bg-white/10'
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => {
          onClick();
          onNavigate?.();
        }}
        className={className}
      >
        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">{icon}</div>
        <div className="leading-[18px]">{label}</div>
      </button>
    );
  }

  return (
    <Link
      prefetch={true}
      href={path}
      {...path.indexOf('http') === 0 && { target: '_blank' }}
      className={className}
      onClick={onNavigate}
    >
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">{icon}</div>
      <div className="leading-[18px]">{label}</div>
    </Link>
  );
};
