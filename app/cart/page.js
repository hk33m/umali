'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';

export default function CartPage() {
  // جلب البيانات من Zustand Store
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  // حساب الإجمالي
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ==========================================
  // 1. شاشة "السلة فارغة"
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4" dir="rtl">
          <Header></Header>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center"
          >
          <div className="bg-orange-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-16 h-16 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            سلتك فارغة حالياً
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            يبدو أنك لم تقم بإضافة أي من منتجاتنا اللذيذة إلى سلتك بعد. تصفح قائمتنا واكتشف أشهى المأكولات!
          </p>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 mx-auto">
              <span>العودة للتسوق</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // 2. واجهة السلة (تحتوي على منتجات)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans mt-16" dir="rtl">
         <Header></Header>
      <div className="max-w-7xl mx-auto">
        
        {/* عنوان الصفحة */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">سلة المشتريات</h1>
          <p className="text-gray-500">لديك {cartItems.length} منتجات في سلتك</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 align-top">
          
          {/* العمود الأيمن: قائمة المنتجات */}
          <div className="w-full lg:w-2/3 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:shadow-md transition-shadow"
              >
                {/* صورة المنتج */}
                <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                  
                  {/* الاسم والسعر */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category || 'تصنيف المنتج'}</p>
                    <p className="text-xl font-black text-orange-500 mt-2">{item.price} <span className="text-sm font-normal text-gray-400">ريال</span></p>
                  </div>

                  {/* أزرار التحكم بالكمية والحذف */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    
                    {/* أزرار الزيادة والنقصان */}
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 hover:bg-white rounded-md transition-colors text-gray-600 hover:text-orange-500 hover:shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-gray-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 hover:bg-white rounded-md transition-colors text-gray-600 hover:text-orange-500 hover:shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">إزالة</span>
                    </button>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* العمود الأيسر: ملخص الطلب (Sticky Sidebar) */}
          <div className="w-full lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 sticky top-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-gray-900">{totalPrice} ريال</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>رسوم التوصيل:</span>
                  <span className="font-bold text-green-500 bg-green-50 px-2 py-1 rounded">مجاني</span>
                </div>
                
                <hr className="border-gray-100 my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">الإجمالي النهائي:</span>
                  <span className="text-2xl font-black text-orange-500">{totalPrice} <span className="text-sm font-medium text-gray-400">ريال</span></span>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="space-y-3">
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full bg-gray-900 hover:bg-orange-500 text-white py-6 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-1">
                    إتمام الشراء الآن
                  </Button>
                </Link>
                
                <Link href="/products" className="block w-full">
                  <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 py-6 rounded-xl font-medium transition-colors">
                    متابعة التسوق
                  </Button>
                </Link>
              </div>

              {/* رسالة ثقة (Trust Badge) */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>تسوق آمن ومحمي 100%</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}