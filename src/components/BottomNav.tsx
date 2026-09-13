'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Beranda',
      href: '/beranda',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#5B2D8E' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-brand-600' : 'text-ink-500'}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      name: 'Rute',
      href: '/dashboard',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#5B2D8E' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-brand-600' : 'text-ink-500'}>
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      ),
    },
    {
      name: 'Galigo AI',
      href: '/tanya-galigo',
      icon: (isActive: boolean) => (
        <div className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#C2379B' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-magenta-500' : 'text-ink-500'}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-magenta-500">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      name: 'Komunitas',
      href: '/komunitas',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#5B2D8E' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-brand-600' : 'text-ink-500'}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      name: 'Profil',
      href: '/profil',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#5B2D8E' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-brand-600' : 'text-ink-500'}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-line bg-card pb-safe">
      <div className="flex h-16 w-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/beranda' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex w-16 flex-col items-center justify-center gap-1"
            >
              {item.icon(isActive)}
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-brand-600' : 'text-ink-500'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
