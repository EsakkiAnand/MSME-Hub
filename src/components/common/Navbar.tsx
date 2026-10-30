import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Send,
  Building2,
  ChevronRight,
  LayoutDashboard,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { TopBar } from './TopBar';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackSearchId, setTrackSearchId] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Overview', href: '/#about' },
    { label: '6-Gate Protocol', href: '/#how-it-works' },
    { label: 'Diagnostic Finder', href: '/#diagnostic' },
    { label: 'Categories', href: '/#industries' },
    { label: 'Lab Infrastructure', href: '/#labs' },
    { label: 'Live Stream', href: '/#live-feed' },
    { label: 'UI Kit', href: '/design-system', badge: 'Dev' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
        <TopBar />
        <header
          className={cn(
            'transition-all duration-200 border-b',
            isScrolled
              ? 'glass-nav py-2.5 shadow-elevation border-slate-200/90'
              : 'bg-white py-3.5 border-slate-200'
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* College & Hub Emblem */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-900 transition-colors">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                      FXEC <span className="text-blue-700">MSME HUB</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-700 border border-slate-200 uppercase">
                      Tirunelveli
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                    Industrial Technical Intervention & Incubation Cell
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden xl:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    location.pathname === link.href ||
                    (link.href.startsWith('/#') && location.hash === link.href.replace('/', ''));

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5',
                        isActive
                          ? 'text-blue-900 bg-blue-50/80 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      )}
                    >
                      {link.label}
                      {link.badge && (
                        <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.2 text-[9px] font-bold font-mono">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Desktop Right CTAs */}
              <div className="hidden lg:flex items-center gap-2.5">
                <Link to="/track-status">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-slate-700 border-slate-300 hover:bg-slate-50"
                    leftIcon={<Search className="h-3.5 w-3.5 text-slate-400" />}
                  >
                    Track Submission
                  </Button>
                </Link>

                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-medium text-slate-700 hover:bg-slate-100"
                    leftIcon={<LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />}
                  >
                    Staff Portal
                  </Button>
                </Link>

                <Link to="/submit-problem">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm"
                    rightIcon={<Send className="h-3 w-3 text-cyan-300" />}
                  >
                    Submit Problem (60s)
                  </Button>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="flex lg:hidden items-center gap-2">
                <Link to="/submit-problem">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs h-8 px-2.5 bg-blue-900 text-white font-bold"
                  >
                    Submit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-fade-in z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center text-cyan-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                      FXEC MSME HUB
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Francis Xavier Engineering College
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                ))}
                <Link
                  to="/track-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>Track Submission (Member 4)</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>Staff Portal (Member 3)</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <Link to="/submit-problem" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full bg-blue-900 text-white font-bold text-xs h-10">
                  Submit an Industrial Problem
                </Button>
              </Link>
              <p className="text-[10px] text-center text-slate-400">
                Francis Xavier Engineering College, Tirunelveli
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
