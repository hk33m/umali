"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname , useRouter} from 'next/navigation';

import { Home, Package, Image as ImageIcon, Megaphone, Settings, LogOut, X } from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

const handleLogout = () => {
  // حذف التوكن من الكوكيز
  document.cookie = "adminToken=; path=/; max-age=0";
  // التوجيه لصفحة تسجيل الدخول
  router.push('/admin/login');
};

  const menuItems = [
    { id: 1, title: 'الرئيسية', icon: Home, path: '/admin' },
    { id: 2, title: 'المنتجات', icon: Package, path: '/admin/ProductManager' },
    { id: 3, title: 'البنرات', icon: ImageIcon, path: '/admin/bannermanagement' },
    { id: 4, title: 'الإعلانات', icon: Megaphone, path: '/admin/OfferManager' },
    { id: 5, title: 'الإعدادات', icon: Settings, path: '/admin/' },
  ];

  return (
    <aside className="flex flex-col w-64 h-full bg-slate-900 text-slate-300 relative">
      {/* زر إغلاق للشاشات الصغيرة */}
      <button 
        onClick={closeSidebar}
        className="absolute top-4 left-4 p-2 text-gray-400 md:hidden hover:text-white"
      >
        <X size={24} />
      </button>

      <div className="flex items-center justify-center h-20 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={closeSidebar} // إغلاق القائمة عند اختيار صفحة في الجوال
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-amber-500 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
        onClick={handleLogout}
        className="flex items-center w-full gap-3 px-4 py-3 text-red-400 rounded-lg transition-colors duration-200 hover:bg-slate-800 hover:text-red-300">
          <LogOut size={20} />
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;