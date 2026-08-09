"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus,ArrowLeftFromLine } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";


export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  
  // تعديل: تهيئة المتغير بمصفوفة فارغة لتجنب أخطاء الـ length
  const [productsList, setProductsList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const result = await response.json();

        if (result.success) {
          setProductsList(
            result.data.map((product) => ({ ...product, quantity: 1 }))
          );
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب المنتجات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const increaseQuantity = (id) => {
    setProductsList((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (id) => {
    setProductsList((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity > 1 ? product.quantity - 1 : 1 }
          : product
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
        <p className="text-gray-500 font-medium">جاري تحضير أشهى المأكولات...</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto" dir="rtl">
        
        {/* الترويسة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-2">منتجاتنا المميزة</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-2">
            تشكيلة فاخرة من مخبز أم علي المطبوخ بأفضل الوصفات الشرقية الأصيلة
          </p>
          <div className="text-left text-primary flex justify-end text-sm  " > 
            <Link href={"/products"}
            className="flex px-2 py-4 rounded-lg border "
             >تصفح جميع المنتجات 
             <ArrowLeftFromLine className="w-4 h-4" />
             </Link>
          </div>
        </motion.div>

        {/* شبكة المنتجات (تم تصحيح الأخطاء هنا) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {productsList.length > 0 ? (
            productsList.slice(0, 6).map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group h-full flex flex-col"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-border">
                  
                  {/* شارة المنتج (Badge) */}
                  {product.badge_text && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold">
                        {product.badge_text}
                      </span>
                    </div>
                  )}

                  {/* صورة المنتج */}
                  <div className="relative w-full h-64 overflow-hidden bg-muted">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                        {product.product_type || "صنف مميز"}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4 flex-grow">
                      {product.description}
                    </p>

                    {/* التقييم */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-accent text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < Math.floor(product.rating || 5) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="text-lg md:text-xl font-bold text-primary mb-6">
                      {product.price} ريال
                    </div>

                    {/* أزرار الكمية والإضافة للسلة */}
                    <div className="flex gap-3 mt-auto">
                      <div className="flex items-center border border-border rounded-lg bg-gray-50">
                        <button
                          onClick={() => decreaseQuantity(product.id)}
                          className="p-2 hover:bg-white rounded-md transition-colors text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-bold text-gray-900 select-none">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(product.id)}
                          className="p-2 hover:bg-white rounded-md transition-colors text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <Button
                        onClick={() => {
                          const existingItem = cartItems.find((item) => item.id === product.id);
                          if (existingItem) {
                            toast.info(`${product.name} موجود بالفعل في السلة`);
                          } else {
                            addToCart(product);
                            toast.success(`تم إضافة ${product.name} إلى السلة`);
                          }
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        أضف للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
           
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg text-muted-foreground font-medium">لا توجد منتجات متاحة في الوقت الحالي. يرجى العودة لاحقًا.</p>
            </div>
          )}
          {productsList.length > 1 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-8">
              <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-bold">
                عرض المزيد من المنتجات
              </Link>
            </div>
          )}
        </motion.div>

        {/* عرض خاص */}
        

      </div>
    </section>
  );
}