"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // استيراد usePathname
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // جلب المسار الحالي

  // التحقق: إذا كانت الصفحة هي صفحة تسجيل الدخول، اعرض المحتوى فقط (بدون القوائم)
  if (pathname === '/admin/login') {
    return <div dir="rtl" className="min-h-screen bg-gray-50">{children}</div>;
  }

  // إذا كانت أي صفحة أخرى داخل admin، اعرض لوحة التحكم كاملة
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir="rtl">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 right-0 z-50 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
}