import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowDown, Building2, Globe, RefreshCw,
  CheckCircle, Workflow, CreditCard, Users, Landmark
} from 'lucide-react';

import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function GTransWorkScheme() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gtrans_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('gtrans_language', language);
  }, [language]);

  const coreFlow = [
    {
      step: 1,
      icon: Building2,
      title: language === 'en' ? 'Originator' : 'Pengirim',
      description: language === 'en' 
        ? 'Corporate client initiates transfer order through GTrans platform'
        : 'Klien korporat memulai pesanan transfer melalui platform GTrans',
      color: 'bg-[#1e3a5f]'
    },
    {
      step: 2,
      icon: Workflow,
      title: 'GTrans (GAN)',
      description: language === 'en'
        ? 'GAN as Executing Sender processes the order with full compliance'
        : 'GAN sebagai Pengirim Pelaksana memproses pesanan dengan kepatuhan penuh',
      color: 'bg-[#f5a623]'
    },
    {
      step: 3,
      icon: Globe,
      title: language === 'en' ? 'Banking Network' : 'Jaringan Perbankan',
      description: language === 'en'
        ? 'Transfer routed through partner banks and correspondent networks'
        : 'Transfer dialirkan melalui bank mitra dan jaringan koresponden',
      color: 'bg-emerald-600'
    },
    {
      step: 4,
      icon: Users,
      title: language === 'en' ? 'Beneficiary' : 'Penerima',
      description: language === 'en'
        ? 'Funds delivered to beneficiary account in destination country'
        : 'Dana dikirim ke rekening penerima di negara tujuan',
      color: 'bg-cyan-600'
    }
  ];

  const flowTypes = [
    {
      title: language === 'en' ? 'Outbound from Indonesia' : 'Keluar dari Indonesia',
      description: language === 'en'
        ? 'Transfer funds from Indonesian entities to beneficiaries worldwide. Supports both same-currency and FX conversion.'
        : 'Transfer dana dari entitas Indonesia ke penerima di seluruh dunia. Mendukung mata uang yang sama dan konversi FX.',
      flows: [
        { from: 'IDR', to: 'USD/EUR/CNY', type: language === 'en' ? 'With FX' : 'Dengan FX' },
        { from: 'USD', to: 'USD', type: language === 'en' ? 'Same Currency' : 'Mata Uang Sama' }
      ]
    },
    {
      title: language === 'en' ? 'Outbound from Other Countries' : 'Keluar dari Negara Lain',
      description: language === 'en'
        ? 'Process transfers originating from entities outside Indonesia to various destinations.'
        : 'Proses transfer yang berasal dari entitas di luar Indonesia ke berbagai tujuan.',
      flows: [
        { from: 'USD/EUR', to: 'IDR', type: language === 'en' ? 'To Indonesia' : 'Ke Indonesia' },
        { from: 'CNY', to: 'USD', type: language === 'en' ? 'Cross-currency' : 'Lintas Mata Uang' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader language={language} setLanguage={setLanguage} />
      
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] text-sm font-medium mb-6">
              <Workflow className="w-4 h-4" />
              {language === 'en' ? 'Work Scheme' : 'Skema Kerja'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
              {language === 'en' ? 'Core Funds-Flow Structure' : 'Struktur Aliran Dana Inti'}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Understanding how GTrans processes cross-border transactions from origination to settlement.'
                : 'Memahami bagaimana GTrans memproses transaksi lintas batas dari inisiasi hingga penyelesaian.'
              }
            </p>
          </div>

          {/* Core Flow Diagram */}
          <Card className="border-slate-200 mb-16">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8 text-center">
                {language === 'en' ? 'GTrans Transfer Flow' : 'Alur Transfer GTrans'}
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                {coreFlow.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center text-center flex-1"
                    >
                      <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <item.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-xs font-medium text-slate-400 mb-1">
                        {language === 'en' ? 'Step' : 'Langkah'} {item.step}
                      </div>
                      <h3 className="font-bold text-[#1e3a5f] mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-500 max-w-[180px]">{item.description}</p>
                    </motion.div>
                    
                    {idx < coreFlow.length - 1 && (
                      <div className="hidden md:block">
                        <ArrowRight className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    {idx < coreFlow.length - 1 && (
                      <div className="md:hidden">
                        <ArrowDown className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flow Types */}
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">
            {language === 'en' ? 'Transfer Types' : 'Jenis Transfer'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {flowTypes.map((flowType, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-slate-200 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{flowType.title}</h3>
                    <p className="text-slate-600 mb-6">{flowType.description}</p>
                    <div className="space-y-3">
                      {flowType.flows.map((flow, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-4 bg-slate-50 rounded-lg p-4">
                          <div className="px-3 py-1 rounded bg-[#1e3a5f] text-white text-sm font-medium">
                            {flow.from}
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400" />
                          <div className="px-3 py-1 rounded bg-emerald-600 text-white text-sm font-medium">
                            {flow.to}
                          </div>
                          <span className="text-sm text-slate-500 ml-auto">{flow.type}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FX Options */}
          <Card className="border-slate-200 mb-16">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#f5a623]/20 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-7 h-7 text-[#f5a623]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                    {language === 'en' ? 'FX Conversion Options' : 'Opsi Konversi FX'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        {language === 'en' ? 'Without FX Conversion' : 'Tanpa Konversi FX'}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          {language === 'en' 
                            ? 'Transfer in original currency to beneficiaries holding same-currency accounts'
                            : 'Transfer dalam mata uang asli ke penerima dengan rekening mata uang yang sama'
                          }
                        </li>
                        <li className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          {language === 'en' ? 'No FX spread applied' : 'Tidak ada spread FX yang diterapkan'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        {language === 'en' ? 'With FX Conversion' : 'Dengan Konversi FX'}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          {language === 'en'
                            ? 'Convert between any supported currencies at client\'s instruction'
                            : 'Konversi antara mata uang yang didukung sesuai instruksi klien'
                          }
                        </li>
                        <li className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          {language === 'en' ? 'Competitive FX rates' : 'Kurs FX kompetitif'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card className="border-slate-200 bg-[#1e3a5f] text-white mb-16">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Legal Basis & Service Agreement' : 'Dasar Hukum & Perjanjian Layanan'}
              </h3>
              <p className="text-slate-300 mb-6">
                {language === 'en'
                  ? 'GAN operates as Executing Sender under the Customer Service Agreement, limited to transfer and settlement of funds per client instructions. GAN bears no liability for the underlying commercial transaction between parties.'
                  : 'GAN beroperasi sebagai Pengirim Pelaksana berdasarkan Perjanjian Layanan Pelanggan, terbatas pada transfer dan penyelesaian dana sesuai instruksi klien. GAN tidak bertanggung jawab atas transaksi komersial yang mendasari antara para pihak.'
                }
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 rounded-lg bg-white/10">
                  <span className="text-sm">{language === 'en' ? 'BI PSP Licensed' : 'Berlisensi PSP BI'}</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/10">
                  <span className="text-sm">{language === 'en' ? 'Remittance Service' : 'Layanan Remitansi'}</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/10">
                  <span className="text-sm">{language === 'en' ? 'Fully Compliant' : 'Sepenuhnya Patuh'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
              {language === 'en' ? 'Ready to Start?' : 'Siap untuk Memulai?'}
            </h3>
            <p className="text-slate-600 mb-6">
              {language === 'en'
                ? 'Contact our team to learn more about integrating with GTrans.'
                : 'Hubungi tim kami untuk mempelajari lebih lanjut tentang integrasi dengan GTrans.'
              }
            </p>
            <Link to={createPageUrl('GTransContactSales')}>
              <Button className="bg-[#1e3a5f] hover:bg-[#152a45]">
                {language === 'en' ? 'Contact Sales' : 'Hubungi Sales'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter language={language} setLanguage={setLanguage} />
    </div>
  );
}