"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة التحقق من بيانات مدير "مخبز أم علي"
    setTimeout(() => {
      if (email === 'umali' && password === 'u1234') {
        // حفظ التوكن في الكوكيز بصلاحية يوم واحد (86400 ثانية) ليتمكن الـ Middleware من قراءته
document.cookie = "adminToken=mock-token-12345; path=/; max-age=86400";
        router.push('/admin'); // التوجيه للوحة التحكم الرئيسية
      } else {
        setError('بيانات الدخول غير صحيحة.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">إدارة المخبز</h1>
          <p className="text-slate-500">تسجيل الدخول للوحة التحكم</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              البريد الإلكتروني للإدارة
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <Mail size={20} />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full py-3 pr-10 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              كلمة المرور
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 pr-10 pl-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 focus:ring-4 focus:ring-slate-200"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                <span className="font-semibold">تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}