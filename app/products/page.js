"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"

export default function StoreProducts() {
    // ==========================================
    // 1. إدارة الحالة (State)
    // ==========================================
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
    
    // الفلاتر والبحث
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // أقسام وهمية للتجربة (يمكنك جلبها من الداتابيز لاحقاً)
    const categories = [
        { id: 'all', name: 'جميع المنتجات' },
        { id: 'Bread', name: 'خبز' },
        { id: 'Toast', name: 'توست' },
        { id: 'Croissant', name: 'كرواسن ' },
        { id: 'Cake', name: 'كيك ' },
        { id: 'PASTRY', name: 'معجنات اخرى ' },
    ];

    // ==========================================
    // 2. جلب البيانات من الـ API
    // ==========================================
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                const result = await response.json();

                if (result.success) {
                    // نفترض أن الخادم يرسل المنتجات المتاحة فقط للزوار
                   
                    setProducts(result.data.map((product) => ({ ...product, quantity: 1 })));
                }
            } catch (error) {
                console.error("حدث خطأ أثناء جلب المنتجات:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    //زيادة ز انقاص  الكمية
     const increaseQuantity = (id) => {
    
     const prod = products.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product,
      )
    
      setProducts(prod);
  };

  const decreaseQuantity = (id) => {
    
      const prod = products.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity > 1 ? product.quantity - 1 : 1,
            }
          : product,
      )
      setProducts(prod);
    
  };

    // ==========================================
    // 3. فلترة المنتجات (بحث + تصنيف)
    // ==========================================
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // البحث بالاسم
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            // الفلترة بالقسم (بافتراض وجود حقل category_id أو category_name)
            const matchesCategory = selectedCategory === "all" || product.product_type === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // ==========================================
    // 4. واجهة التحميل للزوار
    // ==========================================
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

    if (isLoading) {
        return (
          <div>
          <Header></Header>
            <div className="bg-gray-50 min-h-screen font-sans mt-20" dir="rtl">
    
      <div className="bg-orange-50 py-12 px-4 text-center border-b border-orange-100">
        <Skeleton className="h-8 md:h-10 w-64 mx-auto mb-4 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto rounded-md" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
       
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          
         
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>

          <div className="w-full md:w-72">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group h-full flex flex-col">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full border border-border">
                
           
                <Skeleton className="w-full h-64 rounded-none" />

                <div className="p-6 flex flex-col flex-grow space-y-4">

                  <Skeleton className="h-3 w-20 rounded" />

               
                  <Skeleton className="h-5 w-3/4 rounded-md" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>

   
                  <Skeleton className="h-6 w-20 rounded" />

                  <div className="flex gap-3 mt-auto pt-2">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-16 rounded-lg" />
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    
    </div>
    <Footer></Footer>
        </div>
        );

    }

    // ==========================================
    // 5. واجهة الزائر (Storefront UI)
    // ==========================================
    return (
        <div className="bg-gray-50 min-h-screen font-sans mt-20" dir="rtl">
            <Header></Header>
            
            {/* قسم الترويسة (Hero Section) */}
            <div className="bg-orange-50 py-12 px-4 text-center border-b border-orange-100">
                <h1 className="text-2xl md:text-4xl font-black text-gray-800 mb-4">
                    قائمة <span className="text-orange-500">مخبز أم علي</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                    تصفح أشهى المنتجات المصنوعة بحب وعناية. اختر ما يناسب ذوقك وأضفه إلى سلتك مباشرة.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* شريط البحث والفلاتر */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                    
                    {/* أزرار الأقسام (Categories) */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* مربع البحث */}
                    <div className="relative w-full md:w-72">
                        <input 
                            type="text" 
                            placeholder="ابحث عن منتج..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-11 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>


                {/* شبكة المنتجات (Product Grid) */}
                {filteredProducts.length > 0 ? (
                    <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
                        {filteredProducts.map((product) => (
                            <motion.div
                                          key={product.id}
                                          variants={itemVariants}
                                          className="group h-full flex flex-col"
                                        >
                                          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-border">
                                            {product.badge_text && (
                                              <div className="absolute top-4 right-4 z-10">
                                                <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold">
                                                  {product.badge_text}
                                                </span>
                                              </div>
                                            )}
                            
                                            <div className="relative w-full h-64 overflow-hidden bg-muted">
                                              
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                              />                      
                                            </div>
                            
                                            <div className="p-6 flex flex-col flex-grow">
                                              <div className="mb-3">
                                                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                                                  {product.product_type || "صنف مميز"}
                                                </span>
                                              </div>
                            
                                              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                                                {product.name}
                                              </h3>
                                              <p className="text-gray-60 text-sm md:text-base mb-4 flex-grow">
                                                {product.description}
                                              </p>
                            
                                              <div className="flex items-center gap-2 mb-4">
                                                <div className="flex text-accent text-sm">
                                                  {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="text-lg">
                                                      {i < Math.floor(product.rating) ? "★" : "☆"}
                                                    </span>
                                                  ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                  ({product.reviews})
                                                </span>
                                              </div>
                            
                                              <div className="text-lg md:text-xl font-bold text-primary mb-6">
                                                {product.price} ريال
                                              </div>
                            
                                              <div className="flex gap-3 mt-auto">
                                                <div className="flex items-center border border-border rounded-lg">
                                                  <button
                                                    onClick={() => decreaseQuantity(product.id)}
                                                    className="p-2 hover:bg-muted transition-colors"
                                                  >
                                                    <Minus className="w-4 h-4" />
                                                  </button>
                                                  <span className="px-4 py-2 font-semibold">
                                                    {product.quantity}
                                                  </span>
                                                  <button
                                                    onClick={() => increaseQuantity(product.id)}
                                                    className="p-2 hover:bg-muted transition-colors"
                                                  >
                                                    <Plus className="w-4 h-4" />
                                                  </button>
                                                </div>
                                                <Button
                                                  onClick={() => {
                                                    const existingItem = cartItems.find(
                                                      (item) => item.id === product.id,
                                                    );
                            
                                                    if (existingItem) {
                                                      toast.info(`${product.name} موجود بالفعل في السلة`);
                                                    } else {
                                                      addToCart(product);
                                                      toast.success(`${product.name} تم إضافته إلى السلة`);
                                                    }
                                                  }}
                                                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                  <ShoppingCart className="w-5 h-5" />
                                                  أضف للسلة
                                                </Button>
                                                <Link href={`/products/${product.id}`}> 
                                                <Button className='bg-gray-50 text-primary hover:bg-gray-100 cursor-pointer'>تفاصيل</Button>
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* حالة عدم وجود منتجات */
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mt-10">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">عذراً، لم نجد ما تبحث عنه</h3>
                        <p className="text-gray-500">جرب البحث باسم مختلف أو تصفح قسماً آخر من المتجر.</p>
                        <button 
                            onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                            className="mt-6 text-orange-500 font-bold hover:underline"
                        >
                            عرض جميع المنتجات
                        </button>
                    </div>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
}