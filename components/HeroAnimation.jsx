"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    const frameCount = 100; // تأكد من وضع عدد الصور الفعلي
    const currentFrame = (index) => `/frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

    const images = [];
    const frames = { frame: 0 };

    // تحميل جميع الصور مسبقاً
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // دالة الرسم المحدثة (بدون تشويه)
    const render = () => {
      if (images[frames.frame] && images[frames.frame].complete) {
        const img = images[frames.frame];
        
        // استخدام الأبعاد الفعلية للعنصر
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // استخدام Math.min لظهور المنتج بالكامل (سلوك Contain)
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
        
        // حساب إحداثيات المنتصف بدقة
        const x = (canvasWidth / 2) - ((img.width * scale) / 2);
        const y = (canvasHeight / 2) - ((img.height * scale) / 2);

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // ضبط الدقة لتكون عالية الوضوح على شاشات الجوال
    const updateCanvasSize = () => {
      const ratio = window.devicePixelRatio || 1;
      
      // ضبط الأبعاد الداخلية للكانفاس بناءً على كثافة البكسلات
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      
      // توحيد المقياس ليعمل بشكل صحيح مع دالة الرسم
      ctx.scale(ratio, ratio);
      
      render();
    };

    // تشغيل التحديث فور تحميل أول صورة
    images[0].onload = () => {
      updateCanvasSize();
    };

    gsap.to(frames, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top", 
        end: "+=3000", 
        scrub: 0.5, 
        pin: true, 
      },
      onUpdate: render, 
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // تحديث الأبعاد عند تغيير حجم الشاشة أو تدوير الجوال
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full h-screen relative bg-transparent">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </section>
  );
}