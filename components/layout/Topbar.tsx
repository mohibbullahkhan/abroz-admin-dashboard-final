'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


export const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    window.location.href = '/login';
  };

  // Generate page title from pathname
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center h-16 px-6 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'glass border-border py-2' : 'bg-transparent py-4'
      )}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 lg:ml-0 ml-12">
        <span className="text-xs text-text-muted">Pages</span>
        <ChevronRight size={12} className="text-text-muted" />
        <h1 className="text-sm font-semibold text-text-primary">{getPageTitle()}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-200 cursor-pointer group"
        >
          <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
};
