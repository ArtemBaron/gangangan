import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, Menu, X, Globe, ArrowRight,
  CreditCard, RefreshCw, Building2, ShoppingCart, 
  Code, MessageSquare, FileText, HelpCircle, Workflow
} from 'lucide-react';
import { cn } from "@/lib/utils";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69233f5a9a123941f81322f5/b1a1be267_gan.png";

export default function PublicHeader({ language, setLanguage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      label: language === 'en' ? 'Products' : 'Produk',
      items: [
        { 
          label: language === 'en' ? 'B2B Payments' : 'Pembayaran B2B', 
          description: language === 'en' ? 'Cross-border pay-in / pay-out for businesses' : 'Pembayaran lintas batas untuk bisnis',
          icon: CreditCard,
          href: createPageUrl('GTrans') + '#products'
        },
        { 
          label: language === 'en' ? 'FX Solutions' : 'Solusi FX', 
          description: language === 'en' ? 'Multi-currency transfer with competitive rates' : 'Transfer multi-mata uang dengan kurs kompetitif',
          icon: RefreshCw,
          href: createPageUrl('GTrans') + '#products'
        }
      ]
    },
    {
      label: language === 'en' ? 'Solutions' : 'Solusi',
      items: [
        { 
          label: language === 'en' ? 'Exporters & Importers' : 'Eksportir & Importir', 
          description: language === 'en' ? 'Streamline international trade payments' : 'Permudah pembayaran perdagangan internasional',
          icon: Building2,
          href: createPageUrl('GTrans') + '#solutions'
        },
        { 
          label: language === 'en' ? 'Marketplaces & Platforms' : 'Marketplace & Platform', 
          description: language === 'en' ? 'Collect and settle globally' : 'Kumpulkan dan selesaikan secara global',
          icon: ShoppingCart,
          href: createPageUrl('GTrans') + '#solutions'
        },
        { 
          label: language === 'en' ? 'API Integration' : 'Integrasi API', 
          description: language === 'en' ? 'Connect via our platform APIs' : 'Hubungkan melalui API platform kami',
          icon: Code,
          href: createPageUrl('GTransDocumentation')
        }
      ]
    },
    {
      label: language === 'en' ? 'Resources' : 'Sumber Daya',
      items: [
        { 
          label: language === 'en' ? 'Documentation' : 'Dokumentasi', 
          icon: FileText,
          href: createPageUrl('GTransDocumentation')
        },
        { 
          label: language === 'en' ? 'Work Scheme' : 'Skema Kerja', 
          icon: Workflow,
          href: createPageUrl('GTransWorkScheme')
        },
        { 
          label: language === 'en' ? 'FAQ' : 'FAQ', 
          icon: HelpCircle,
          href: createPageUrl('GTransFAQ')
        }
      ]
    }
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm py-2" 
        : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('GTrans')} className="flex items-center gap-3">
            <div className={cn(
              "rounded-lg flex items-center justify-center p-1 transition-all",
              scrolled ? "w-10 h-10 bg-white shadow" : "w-12 h-12 bg-white/90"
            )}>
              <img src={LOGO_URL} alt="GTrans" className="w-full h-full object-contain" />
            </div>
            <span className={cn(
              "font-bold transition-all",
              scrolled ? "text-lg text-[#1e3a5f]" : "text-xl text-[#1e3a5f]"
            )}>
              GTrans
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, idx) => (
              <div 
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-700 hover:bg-white/50"
                )}>
                  {item.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === idx && "rotate-180"
                  )} />
                </button>
                
                {activeDropdown === idx && (
                  <div className="absolute top-full left-0 pt-2 w-80">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.items.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          to={subItem.href}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                            <subItem.icon className="w-5 h-5 text-[#1e3a5f]" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{subItem.label}</div>
                            {subItem.description && (
                              <div className="text-sm text-slate-500 mt-0.5">{subItem.description}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                scrolled ? "text-slate-600 hover:bg-slate-100" : "text-slate-600 hover:bg-white/50"
              )}
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'EN' : 'ID'}
            </button>

            <Link to={createPageUrl('GTransLogin')}>
              <Button variant="ghost" className="text-slate-700">
                {language === 'en' ? 'Login' : 'Masuk'}
              </Button>
            </Link>

            <Link to={createPageUrl('GTransContactSales')}>
              <Button className="bg-[#1e3a5f] hover:bg-[#152a45]">
                {language === 'en' ? 'Contact Sales' : 'Hubungi Sales'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Link to={createPageUrl('StaffDashboard')}>
              <Button variant="outline" size="sm" className="text-slate-500 border-slate-300">
                {language === 'en' ? 'For Staff' : 'Untuk Staf'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="space-y-2">
              {navItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase px-3 pt-2">
                    {item.label}
                  </div>
                  {item.items.map((subItem, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subItem.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                      <subItem.icon className="w-5 h-5 text-[#1e3a5f]" />
                      <span className="text-slate-700">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
              
              <div className="pt-4 space-y-2 border-t border-slate-200 mt-4">
                <Link to={createPageUrl('GTransLogin')} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {language === 'en' ? 'Login' : 'Masuk'}
                  </Button>
                </Link>
                <Link to={createPageUrl('GTransContactSales')} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#1e3a5f] hover:bg-[#152a45]">
                    {language === 'en' ? 'Contact Sales' : 'Hubungi Sales'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}