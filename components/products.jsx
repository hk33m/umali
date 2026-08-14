"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Grid2X2,
  Square,
  Star,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";

export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);

  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // grid = منتجان / 3 منتجات
  // single = منتج واحد
  const [viewMode, setViewMode] = useState("single");

  useEffect(() => {
    const savedView = localStorage.getItem("products-view-mode");

    if (savedView === "single" || savedView === "grid") {
      setViewMode(savedView);
    }
  }, []);

  const changeViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("products-view-mode", mode);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );

        const result = await response.json();

        if (result.success) {
          setProductsList(
            result.data.map((product) => ({
              ...product,
              quantity: 1,
            }))
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
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    );
  };

  const decreaseQuantity = (id) => {
    setProductsList((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity:
                product.quantity > 1 ? product.quantity - 1 : 1,
            }
          : product
      )
    );
  };

  const addProductToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      toast.info(`${product.name} موجود بالفعل في السلة`);
      return;
    }

    addToCart(product);

    toast.success(`تم إضافة ${product.name} إلى السلة`, {
      description: "استمتع بأشهى مخبوزات أم علي ❤️",
    });
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

          <p className="text-sm font-medium text-muted-foreground">
            جاري تحضير أشهى المخبوزات...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* لمسات خلفية */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#E09F3E]/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-[#4A2C11]/5 blur-3xl" />

      <div
        className="relative mx-auto max-w-7xl"
        dir="rtl"
      >
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            {/* العنوان */}

            <div className="text-center">
              

              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                مخبوزات بطعم البيت
                <span className="mr-2">🥖</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                اختر ما تحب… وكل لقمة تحمل لك شيئًا من نكهة البيت
              </p>
            </div>

            {/* الأزرار */}

            <div className="flex items-center gap-2">
              {/* تبديل العرض */}

              <div className="flex items-center rounded-xl border border-border bg-background p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => changeViewMode("grid")}
                  className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Grid2X2 className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    منتجات
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => changeViewMode("single")}
                  className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all ${
                    viewMode === "single"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Square className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    منتج واحد
                  </span>
                </button>
              </div>

              <Link
                href="/products"
                className="flex h-11 items-center gap-1 rounded-xl border border-border bg-background px-3 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white sm:px-4 sm:text-sm"
              >
                تصفح الكل

                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ================= PRODUCTS ================= */}

        {productsList.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "-100px",
            }}
            className={`grid gap-4 sm:gap-6 ${
              viewMode === "single"
                ? "grid-cols-1"
                : "grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {productsList.slice(0, 6).map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="group"
              >
                <div
                  className={`relative flex h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    viewMode === "single"
                      ? "flex-col md:flex-row"
                      : "flex-col"
                  }`}
                >
                  {/* ================= IMAGE ================= */}

                  <div
                    className={`relative overflow-hidden bg-muted ${
                      viewMode === "single"
                        ? "h-64 w-full md:h-auto md:min-h-[320px] md:w-[45%]"
                        : "h-44 w-full sm:h-56"
                    }`}
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="absolute inset-0 z-10"
                    />

                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient */}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Badge */}

                    {product.badge_text && (
                      <div className="absolute right-3 top-3 z-20">
                        <span className="rounded-full bg-[#E09F3E] px-3 py-1.5 text-[10px] font-black text-[#4A2C11] shadow-lg sm:text-xs">
                          {product.badge_text}
                        </span>
                      </div>
                    )}

                    {/* Favorite */}

                    <button
                      type="button"
                      className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur transition-all hover:scale-110"
                    >
                      <Heart className="h-4 w-4" />
                    </button>

                    {/* نوع المنتج */}

                    <div className="absolute bottom-3 right-3 z-20">
                      <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm backdrop-blur sm:text-xs">
                        {product.product_type || "صنف مميز"}
                      </span>
                    </div>
                  </div>

                  {/* ================= CONTENT ================= */}

                  <div
                    className={`flex flex-1 flex-col ${
                      viewMode === "single"
                        ? "p-5 sm:p-7 md:p-8"
                        : "p-3.5 sm:p-5"
                    }`}
                  >
                    {/* الاسم والوصف */}

                    <div className="flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3
                          className={`font-black leading-6 text-foreground transition-colors hover:text-primary ${
                            viewMode === "single"
                              ? "text-xl sm:text-2xl"
                              : "text-sm sm:text-lg"
                          }`}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      <p
                        className={`mt-2 leading-6 text-muted-foreground ${
                          viewMode === "single"
                            ? "line-clamp-3 text-sm sm:text-base"
                            : "line-clamp-2 text-xs sm:text-sm"
                        }`}
                      >
                        {product.description}
                      </p>

                      {/* Rating */}

                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                i <
                                Math.floor(product.rating || 5)
                                  ? "fill-[#E09F3E] text-[#E09F3E]"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-[10px] text-muted-foreground sm:text-xs">
                          ({product.reviews || 0})
                        </span>
                      </div>
                    </div>

                    {/* ================= PRICE ================= */}

                    <div className={`mt-4 flex ${viewMode === "single" ? "flex-row " : "flex-col "} md:flex-row items-center justify-between border-t border-border pt-4`}>
                      <div>
                        <span className="block text-[10px] text-muted-foreground sm:text-xs">
                          السعر
                        </span>

                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="text-lg font-black text-primary sm:text-xl">
                            {product.price}
                          </span>

                          <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">
                            ريال
                          </span>
                        </div>
                      </div>

                      {/* Quantity */}

                      <div className="flex items-center rounded-lg border border-border bg-muted/40">
                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(product.id)
                          }
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-background hover:text-primary sm:h-9 sm:w-9"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>

                        <span className="min-w-7 text-center text-xs font-black sm:text-sm">
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(product.id)
                          }
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-background hover:text-primary sm:h-9 sm:w-9"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* ================= CART ================= */}

                    <Button
                      onClick={() =>
                        addProductToCart(product)
                      }
                      className={`mt-3 w-full rounded-xl bg-primary font-bold text-white shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md ${
                        viewMode === "single"
                          ? "h-12"
                          : "h-10 sm:h-11"
                      }`}
                    >
                      <ShoppingCart className="ml-1.5 h-4 w-4" />

                      <span className="text-xs sm:text-sm">
                        أضف للسلة
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* ================= EMPTY ================= */

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShoppingCart className="h-7 w-7 text-primary" />
            </div>

            <p className="font-bold text-foreground">
              لا توجد منتجات متاحة حاليًا
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              يرجى العودة لاحقًا 🍞
            </p>
          </div>
        )}

        {/* ================= MORE ================= */}

        {productsList.length > 6 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
            >
              عرض جميع المنتجات

              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}