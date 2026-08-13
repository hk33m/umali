"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // إعداد التشغيل التلقائي (كل 4 ثواني)
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        const data = await res.json();
        
        if (data.success) {
          // تصفية البنرات لعرض "النشطة" فقط
          const activeBanners = data.banners.filter(banner => banner.is_active === 1 || banner.is_active === true);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error("خطأ في جلب البنرات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    // هيكل تحميل وهمي (Skeleton) أثناء جلب البيانات
    return (
      <div className="w-full max-w-6xl mx-auto px-4 mt-20">
        <div className="w-full  bg-gray-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // لا تعرض شيئاً إذا لم تكن هناك بنرات نشطة
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-19 py-4 shadow-xs " dir="rtl">
      <Carousel
        plugins={[plugin.current]}
        className="w-full relative group"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
          direction: "rtl", // دعم الاتجاه من اليمين لليسار
        }}
      >
        <CarouselContent className="-ml-1">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-1">
              <div className="p-1">
                <div className="relative w-full h-auto md:h-[400px] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                  {/* استخدمنا Next/Image لتحسين أداء الصور */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/banners/${banner.image}`}
                    alt="عرض ترويجي"
                    // إعطاء أولوية تحميل لأول بنر
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* أزرار التنقل (تظهر فقط عند تمرير الماوس) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-600 border-none shadow-md" />
          <CarouselNext className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-600 border-none shadow-md" />
        </div>
      </Carousel>
    </div>
  );
}