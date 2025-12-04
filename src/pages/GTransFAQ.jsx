import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, HelpCircle, ArrowRight, Globe, Shield, 
  AlertTriangle, Search
} from 'lucide-react';
import { cn } from "@/lib/utils";

import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

const DEFAULT_FAQS = {
  currencies: [
    {
      question_en: 'What currencies does GTrans support?',
      question_id: 'Mata uang apa saja yang didukung GTrans?',
      answer_en: 'GTrans supports 19+ currencies including: AUD, CAD, CHF, DKK, EUR, GBP, JPY, MYR, NOK, NZD, SAR, THB, SEK, SGD, USD, HKD, CNY, and IDR. We continuously expand our currency coverage based on client needs.',
      answer_id: 'GTrans mendukung 19+ mata uang termasuk: AUD, CAD, CHF, DKK, EUR, GBP, JPY, MYR, NOK, NZD, SAR, THB, SEK, SGD, USD, HKD, CNY, dan IDR. Kami terus memperluas cakupan mata uang berdasarkan kebutuhan klien.'
    },
    {
      question_en: 'Can I transfer without FX conversion?',
      question_id: 'Bisakah saya transfer tanpa konversi FX?',
      answer_en: 'Yes, GTrans supports same-currency transfers where the original currency is delivered directly to beneficiaries holding accounts in that currency, without any FX conversion or spread.',
      answer_id: 'Ya, GTrans mendukung transfer mata uang yang sama di mana mata uang asli dikirimkan langsung ke penerima yang memiliki rekening dalam mata uang tersebut, tanpa konversi FX atau spread.'
    },
    {
      question_en: 'How are exchange rates determined?',
      question_id: 'Bagaimana kurs ditentukan?',
      answer_en: 'Exchange rates are determined at the time of transaction confirmation based on real-time market rates plus a transparent margin. Rates are locked once you confirm the transaction.',
      answer_id: 'Kurs ditentukan pada saat konfirmasi transaksi berdasarkan kurs pasar real-time ditambah margin yang transparan. Kurs dikunci setelah Anda mengkonfirmasi transaksi.'
    }
  ],
  risk_management: [
    {
      question_en: 'What KYC/KYB requirements apply?',
      question_id: 'Persyaratan KYC/KYB apa yang berlaku?',
      answer_en: 'All corporate clients must complete our KYC/KYB process which includes company registration documents, beneficial ownership information, authorized signatories, and source of funds documentation. Our compliance team will provide a detailed checklist during onboarding.',
      answer_id: 'Semua klien korporat harus menyelesaikan proses KYC/KYB kami yang mencakup dokumen pendaftaran perusahaan, informasi kepemilikan benefisial, penandatangan yang berwenang, dan dokumentasi sumber dana. Tim kepatuhan kami akan memberikan daftar periksa detail selama onboarding.'
    },
    {
      question_en: 'How does GTrans handle AML compliance?',
      question_id: 'Bagaimana GTrans menangani kepatuhan AML?',
      answer_en: 'GTrans implements comprehensive AML controls including transaction monitoring, sanctions screening, and suspicious activity reporting. We operate under Bank Indonesia regulations and maintain robust compliance frameworks.',
      answer_id: 'GTrans menerapkan kontrol AML yang komprehensif termasuk pemantauan transaksi, penyaringan sanksi, dan pelaporan aktivitas mencurigakan. Kami beroperasi di bawah regulasi Bank Indonesia dan mempertahankan kerangka kepatuhan yang kuat.'
    },
    {
      question_en: 'Are transactions monitored?',
      question_id: 'Apakah transaksi dipantau?',
      answer_en: 'Yes, all transactions are subject to real-time monitoring for compliance purposes. This includes checks against sanctions lists, unusual activity patterns, and regulatory thresholds.',
      answer_id: 'Ya, semua transaksi dipantau secara real-time untuk tujuan kepatuhan. Ini termasuk pemeriksaan terhadap daftar sanksi, pola aktivitas yang tidak biasa, dan ambang batas regulasi.'
    }
  ],
  prohibited_countries: [
    {
      question_en: 'Are there countries GTrans cannot serve?',
      question_id: 'Apakah ada negara yang tidak bisa dilayani GTrans?',
      answer_en: 'Yes, GTrans cannot process transactions involving countries or territories subject to comprehensive sanctions or those on high-risk jurisdiction lists. This includes but is not limited to countries under OFAC, EU, or UN sanctions. Please contact our compliance team for the current list.',
      answer_id: 'Ya, GTrans tidak dapat memproses transaksi yang melibatkan negara atau wilayah yang terkena sanksi komprehensif atau yang ada dalam daftar yurisdiksi berisiko tinggi. Ini termasuk tetapi tidak terbatas pada negara-negara di bawah sanksi OFAC, EU, atau PBB. Silakan hubungi tim kepatuhan kami untuk daftar terbaru.'
    },
    {
      question_en: 'Can I send funds to individuals in restricted countries?',
      question_id: 'Bisakah saya mengirim dana ke individu di negara terbatas?',
      answer_en: 'GTrans is a B2B service and does not process individual remittances. All transactions must be between registered corporate entities. Transactions involving sanctioned jurisdictions or individuals are prohibited regardless of the beneficiary type.',
      answer_id: 'GTrans adalah layanan B2B dan tidak memproses remitansi individu. Semua transaksi harus antara entitas korporat terdaftar. Transaksi yang melibatkan yurisdiksi atau individu yang terkena sanksi dilarang terlepas dari jenis penerima.'
    }
  ],
  general: [
    {
      question_en: 'How long does a transfer take?',
      question_id: 'Berapa lama waktu yang dibutuhkan untuk transfer?',
      answer_en: 'Transfer times vary depending on the currency pair, destination country, and banking networks involved. Most transfers are completed within 1-3 business days. Some corridors may offer same-day settlement.',
      answer_id: 'Waktu transfer bervariasi tergantung pada pasangan mata uang, negara tujuan, dan jaringan perbankan yang terlibat. Sebagian besar transfer diselesaikan dalam 1-3 hari kerja. Beberapa koridor mungkin menawarkan penyelesaian hari yang sama.'
    },
    {
      question_en: 'What are the transaction limits?',
      question_id: 'Berapa batas transaksi?',
      answer_en: 'Transaction limits are determined during the onboarding process based on your company\'s profile, expected volumes, and regulatory requirements. Limits can be adjusted as your business relationship with GTrans grows.',
      answer_id: 'Batas transaksi ditentukan selama proses onboarding berdasarkan profil perusahaan Anda, volume yang diharapkan, dan persyaratan regulasi. Batas dapat disesuaikan seiring pertumbuhan hubungan bisnis Anda dengan GTrans.'
    },
    {
      question_en: 'How do I track my transfers?',
      question_id: 'Bagaimana cara melacak transfer saya?',
      answer_en: 'All transfers can be tracked in real-time through your GTrans dashboard. You\'ll receive status updates at key milestones including confirmation, processing, and settlement.',
      answer_id: 'Semua transfer dapat dilacak secara real-time melalui dashboard GTrans Anda. Anda akan menerima pembaruan status pada tonggak penting termasuk konfirmasi, pemrosesan, dan penyelesaian.'
    }
  ],
  onboarding: [
    {
      question_en: 'How do I get started with GTrans?',
      question_id: 'Bagaimana cara memulai dengan GTrans?',
      answer_en: 'To get started: 1) Contact our sales team, 2) Receive and complete KYC/KYB documentation, 3) Submit corporate documents for review, 4) Sign the Service Agreement, 5) Receive access credentials and start transacting.',
      answer_id: 'Untuk memulai: 1) Hubungi tim sales kami, 2) Terima dan lengkapi dokumentasi KYC/KYB, 3) Kirim dokumen perusahaan untuk ditinjau, 4) Tandatangani Perjanjian Layanan, 5) Terima kredensial akses dan mulai bertransaksi.'
    },
    {
      question_en: 'How long is the onboarding process?',
      question_id: 'Berapa lama proses onboarding?',
      answer_en: 'The onboarding process typically takes 5-10 business days, depending on the completeness of documentation and any additional due diligence requirements. Our team works to expedite the process wherever possible.',
      answer_id: 'Proses onboarding biasanya memakan waktu 5-10 hari kerja, tergantung pada kelengkapan dokumentasi dan persyaratan due diligence tambahan. Tim kami bekerja untuk mempercepat proses bila memungkinkan.'
    }
  ]
};

const CATEGORY_CONFIG = {
  currencies: {
    icon: Globe,
    label_en: 'Currencies',
    label_id: 'Mata Uang',
    color: 'bg-emerald-100 text-emerald-700'
  },
  risk_management: {
    icon: Shield,
    label_en: 'Risk Management',
    label_id: 'Manajemen Risiko',
    color: 'bg-blue-100 text-blue-700'
  },
  prohibited_countries: {
    icon: AlertTriangle,
    label_en: 'Prohibited Countries',
    label_id: 'Negara Terlarang',
    color: 'bg-red-100 text-red-700'
  },
  general: {
    icon: HelpCircle,
    label_en: 'General',
    label_id: 'Umum',
    color: 'bg-slate-100 text-slate-700'
  },
  onboarding: {
    icon: ArrowRight,
    label_en: 'Onboarding',
    label_id: 'Onboarding',
    color: 'bg-[#f5a623]/20 text-[#f5a623]'
  }
};

export default function GTransFAQ() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gtrans_language') || 'en';
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('gtrans_language', language);
  }, [language]);

  const { data: dbFaqs = [] } = useQuery({
    queryKey: ['faq-items'],
    queryFn: () => base44.entities.FAQItem.filter({ is_published: true }, 'order_index'),
  });

  // Merge DB FAQs with defaults
  const allFaqs = Object.entries(DEFAULT_FAQS).flatMap(([category, items]) => 
    items.map(item => ({ ...item, category }))
  );

  // Add DB items
  dbFaqs.forEach(dbItem => {
    if (!allFaqs.find(f => f.question_en === dbItem.question_en)) {
      allFaqs.push(dbItem);
    }
  });

  // Filter by category and search
  const filteredFaqs = allFaqs.filter(faq => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const question = language === 'en' ? faq.question_en : (faq.question_id || faq.question_en);
      const answer = language === 'en' ? faq.answer_en : (faq.answer_id || faq.answer_en);
      return question.toLowerCase().includes(query) || answer.toLowerCase().includes(query);
    }
    return true;
  });

  const toggleItem = (idx) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(idx)) {
      newOpen.delete(idx);
    } else {
      newOpen.add(idx);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader language={language} setLanguage={setLanguage} />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
              {language === 'en' ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
            </h1>
            <p className="text-lg text-slate-600">
              {language === 'en'
                ? 'Find answers to common questions about GTrans services.'
                : 'Temukan jawaban untuk pertanyaan umum tentang layanan GTrans.'
              }
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search questions...' : 'Cari pertanyaan...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'all' 
                  ? "bg-[#1e3a5f] text-white" 
                  : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {language === 'en' ? 'All' : 'Semua'}
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  activeCategory === key 
                    ? "bg-[#1e3a5f] text-white" 
                    : "bg-white text-slate-600 hover:bg-slate-100"
                )}
              >
                <config.icon className="w-4 h-4" />
                {language === 'en' ? config.label_en : config.label_id}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="p-8 text-center">
                  <p className="text-slate-500">
                    {language === 'en' ? 'No questions found.' : 'Tidak ada pertanyaan yang ditemukan.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const config = CATEGORY_CONFIG[faq.category] || CATEGORY_CONFIG.general;
                const question = language === 'en' ? faq.question_en : (faq.question_id || faq.question_en);
                const answer = language === 'en' ? faq.answer_en : (faq.answer_id || faq.answer_en);
                
                return (
                  <Card key={idx} className="border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleItem(idx)}
                      className="w-full p-6 text-left flex items-start gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={cn("px-3 py-1 rounded-full text-xs font-medium", config.color)}>
                        {language === 'en' ? config.label_en : config.label_id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1e3a5f]">{question}</h3>
                      </div>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-slate-400 transition-transform flex-shrink-0",
                        openItems.has(idx) && "rotate-180"
                      )} />
                    </button>
                    {openItems.has(idx) && (
                      <div className="px-6 pb-6 pt-0">
                        <div className="pl-[88px] text-slate-600 leading-relaxed">
                          {answer}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* CTA */}
          <Card className="border-slate-200 mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                {language === 'en' ? "Can't find what you're looking for?" : 'Tidak menemukan yang Anda cari?'}
              </h3>
              <p className="text-slate-600 mb-6">
                {language === 'en'
                  ? 'Our sales team is happy to answer any additional questions.'
                  : 'Tim sales kami dengan senang hati menjawab pertanyaan tambahan.'
                }
              </p>
              <Link to={createPageUrl('GTransContactSales')}>
                <Button className="bg-[#1e3a5f] hover:bg-[#152a45]">
                  {language === 'en' ? 'Contact Sales' : 'Hubungi Sales'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter language={language} setLanguage={setLanguage} />
    </div>
  );
}