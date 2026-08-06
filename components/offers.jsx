"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Loader2, ArrowRight } from 'lucide-react';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب العروض الفعالة فقط من الـ API الخاص بالزوار
  useEffect(() => {
    async function fetchActiveOffers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`); // استبدل المسار برابط الـ API الخاص بالعروض الفعالة
        const data = await response.json();
        
        if (data.success) {
          setOffers(data.offers);
        } else {
          throw new Error(data.message || 'فشل في تحميل العروض');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] rtl" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 rtl" dir="rtl">
        <p className="text-slate-500 text-lg">عذراً، حدث خطأ أثناء تحميل العروض الحصرية.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 rtl" dir="rtl">
      {/* عنوان القسم */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-3">
          <Sparkles size={16} />
          <span>عروض لفترة محدودة</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          عروض مخبز أم علي الحصرية
        </h1>
        <p className="text-slate-600 text-base">
          استمتع بألذ المعجنات والكيك الطازج بأفضل الأسعار. لا تفوت عروضنا المتميزة المصممة خصيصاً لك.
        </p>
      </div>

      {/* شبكة عرض العروض النشطة */}
      {offers.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-medium text-lg">لا توجد عروض نشطة في الوقت الحالي. ترقبوا المزيد قريباً!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* صورة العرض البانر */}
              <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/offers/${offer.image}`} 
                  alt={offer.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                
                {/* شارة لفترة محدودة */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                  عرض خاص
                </div>
              </div>

              {/* تفاصيل العرض */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {offer.title}
                  </h3>

                  {/* فترة الصلاحية */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    يستمر العرض حتى: <span className="font-semibold text-slate-700">{offer.end_date ? new Date(offer.end_date).toLocaleDateString('ar-SA') : 'قريباً'}</span>
                  </div>
                </div>

                {/* زر الطلب أو الاستفادة من العرض */}
                <button 
                  onClick={() => alert(`تم اختيار العرض: ${offer.title}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-amber-600 text-white font-medium rounded-2xl transition-colors shadow-md"
                >
                  <span>استفد من العرض</span>
                  <ArrowRight size={18} className="rotate-180" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}