"use client";
import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

// استقبال الدالة من الـ Layout
const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      
      <div className="flex items-center gap-4 w-2/3 md:w-1/3">
        {/* زر الهامبرغر يظهر فقط في الشاشات الصغيرة */}
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        {/* شريط البحث */}
        <div className="relative w-full hidden sm:block">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="ابحث هنا..."
            className="w-full py-2 pr-10 pl-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* الإشعارات وملف المستخدم */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <button className="relative p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-r border-gray-200 cursor-pointer">
          <div className="flex flex-col text-left hidden sm:flex">
            <span className="text-sm font-semibold text-gray-700">المدير</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-amber-700 bg-amber-100 rounded-full">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;