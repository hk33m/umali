"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Image as ImageIcon,
  Megaphone,
  ShoppingBag,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";


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
      <h3 className="text-sm font-medium text-gray-500">
        {title}
      </h3>

      <p className="text-2xl font-bold text-gray-800">
        {value}
      </p>
    </div>

  </motion.div>
);



export default function AdminDashboardHome() {


  const [stats, setStats] = useState({
    products: 0,
    banners: 0,
    offers: 0,
    orders: 0,
    totalSales: 0
  });



  useEffect(() => {
  const getStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`
      );

      const result = await res.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  getStats();
}, []);



  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        نظرة عامة
      </h1>


      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">


        <StatCard
          title="المنتجات النشطة"
          value={stats.products}
          icon={Package}
          color="bg-blue-100 text-blue-600"
          delay={0.1}
        />


        <StatCard
          title="البنرات الإعلانية"
          value={stats.banners}
          icon={ImageIcon}
          color="bg-amber-100 text-amber-600"
          delay={0.2}
        />


        <StatCard
          title="العروض (الإعلانات)"
          value={stats.offers}
          icon={Megaphone}
          color="bg-green-100 text-green-600"
          delay={0.3}
        />


        <StatCard
          title="إجمالي الطلبات"
          value={stats.orders}
          icon={ShoppingBag}
          color="bg-purple-100 text-purple-600"
          delay={0.4}
        />


        <StatCard
          title="إجمالي المبيعات"
          value={`${stats.totalSales} ريال`}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
          delay={0.5}
        />


      </div>

    </div>

  );

}