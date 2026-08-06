"use client";
import React from 'react';
import { Package, Image as ImageIcon, Megaphone, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
  >
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={28} />
    </div>
    <div className="mr-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export default function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="المنتجات النشطة" 
          value="124" 
          icon={Package} 
          color="bg-blue-100 text-blue-600" 
          delay={0.1} 
        />
        <StatCard 
          title="البنرات الإعلانية" 
          value="8" 
          icon={ImageIcon} 
          color="bg-amber-100 text-amber-600" 
          delay={0.2} 
        />
        <StatCard 
          title="الحملات (الإعلانات)" 
          value="3" 
          icon={Megaphone} 
          color="bg-green-100 text-green-600" 
          delay={0.3} 
        />
        <StatCard 
          title="الزيارات اليوم" 
          value="1,043" 
          icon={TrendingUp} 
          color="bg-purple-100 text-purple-600" 
          delay={0.4} 
        />
      </div>
    </div>
  );
}