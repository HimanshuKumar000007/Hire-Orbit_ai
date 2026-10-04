"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Orbit,
  Menu,
  X,
  Building2,
  MessageSquareCode,
  SlidersHorizontal,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { SettingsModal } from './SettingsModal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  href?: string;
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'copilot', label: 'AI Copilot', icon: MessageSquareCode, href: '/copilot' },
  { id: 'tailor', label: 'Resume Tailor', icon: SlidersHorizontal, href: '/tailor' },
  { id: 'interview', label: 'Interview Prep', icon: UserCheck, href: '/interview' },
  { id: 'resume', label: 'Resume', icon: FileText, href: '/onboarding' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: 4, href: '/dashboard#jobs' },
  { id: 'companies', label: 'Companies', icon: Building2, href: '/companies' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard#analytics' },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/dashboard' },
];

interface User {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  user?: User;
}

export function Sidebar({ activeItem = 'dashboard', onItemClick, user }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const router = useRouter();
  const supabase = getSupabaseClient();

  // Prevent background scroll chaining on mobile when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const handleClick = (id: string) => {
    onItemClick?.(id);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full w-full bg-zinc-950/95 backdrop-blur-2xl border-r border-white/10 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow">
                <Orbit className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-snug">
                HireOrbit<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Career Intelligence
              </span>
            </div>
          </div>
        </Link>

        {/* Polished Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close Navigation"
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Swipe-to-close hint */}
      <div className="lg:hidden px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500">Navigation</span>
        <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-mono">
          Swipe left to close ←
        </span>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3.5 py-2.5 overflow-y-auto overscroll-contain space-y-6 no-scrollbar">
        <div className="space-y-1">
          <p className="hidden lg:block px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {mainNavItems.map((item) => {
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            const Icon = item.icon;

            return (
              <Link key={item.id} href={item.href || '#'} onClick={() => handleClick(item.id)}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative overflow-hidden group cursor-pointer mb-1',
                    isActive
                      ? 'text-white bg-emerald-500/15 border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {isHovered && !isActive && <div className="absolute inset-0 bg-white/5 rounded-xl pointer-events-none" />}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full shadow-glow-sm"
                    />
                  )}
                  <span className="relative z-10 shrink-0">
                    <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
                  </span>
                  <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-zinc-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={cn('w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600', isActive && 'opacity-60 text-emerald-400')} />
                </motion.button>
              </Link>
            );
          })}
        </div>

        {/* Support & Settings */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          <p className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Support & Preferences
          </p>
          {bottomNavItems.map((item) => {
            const isActive = activeItem === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                onClick={(e) => {
                  if (item.id === 'settings') {
                    e.preventDefault();
                    setIsSettingsOpen(true);
                    setIsOpen(false);
                  } else {
                    handleClick(item.id);
                  }
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group mb-1 cursor-pointer',
                    isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile & Logout Footer */}
      <div className="p-3.5 border-t border-white/5 bg-zinc-950/80">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-sm">
              {user?.name?.slice(0, 2) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email || user?.role || "Active Session"}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sleek Floating Mobile Menu Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open Navigation Menu"
        className="lg:hidden fixed top-3 left-3 z-40 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 text-white border border-white/15 shadow-xl shadow-black/60 backdrop-blur-md cursor-pointer transition-all active:shadow-inner"
      >
        <div className="w-5 h-5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Menu className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-zinc-200 pr-0.5">Menu</span>
      </motion.button>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-72">
        {SidebarContent}
      </aside>

      {/* Mobile Animated Drawer with Drag-to-Dismiss */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Smooth Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Mobile Drawer with Swipe Left Gesture */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.8 }}
              drag="x"
              dragConstraints={{ left: -320, right: 0 }}
              dragElastic={0.05}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -60 || info.velocity.x < -200) {
                  setIsOpen(false);
                }
              }}
              className="fixed left-0 top-0 bottom-0 z-50 h-full w-[84vw] max-w-[310px] lg:hidden shadow-2xl shadow-black/90 focus:outline-none"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user} 
      />
    </>
  );
}
