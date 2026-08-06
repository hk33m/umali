"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 rtl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-xl"
      >
        {/* أيقونة الخطأ مع تأثير نبض */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl shadow-inner animate-pulse">
            <AlertTriangle size={40} />
          </div>
        </div>

        {/* رقم الخطأ والعنوان */}
        <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-wider">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">الصفحة غير موجودة</h2>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          عذراً، يبدو أن الصفحة التي تبحث عنها قد تم نقلها، حُذفت، أو أنك قمت بإدخال رابط غير صحيح.
        </p>

        {/* أزرار التوجيه */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Home size={18} />
            <span>الرئيسية</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span>العودة للخلف</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}