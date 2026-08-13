"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen pt-12 pb-5 shadow-xs  relative overflow-hidden bg-background/30 "
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.p
              variants={itemVariants}
              className="text-primary font-cairo text-sm md:text-base font-semibold"
            >
             🌾 من البر الصحي… وبأيدي أمهات
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-playfair font-bold text-2xl md:text-4xl text-foreground leading-tight"
            >
              مخبز أم علي 
              <br />
              <span className="text-primary"> نكهة البيت، في كل لقمة ❤️  </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground font-cairo leading-relaxed"
            >
             مخبوزاتنا تُحضّر من البر الصحي بدل الدقيق الأبيض، وتُخبز بأيدي أمهات يضعن في كل رغيف شيئًا من حب البيت ودفء المائدة.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-cairo text-base h-12"
              >
                <a href="#products">اطلب الآن</a>
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 font-cairo text-base h-12"
              >
               <a href="#contact"> اعرف المزيد</a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex gap-8 pt-4">
              <div>
                <p className="text-sm md:text-base font-bold text-primary2 font-playfair">
                 🌾 بر صحي
                </p>
                <p className="text-xs text-muted-foreground font-cairo">
                 مخبوزاتنا أساسها البر
                </p>
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-primary2 font-playfair">
                  ❤️ بأيدي أمهات
                </p>
                <p className="text-xs text-muted-foreground font-cairo">
                صُنعت بحب وعناية
                </p>
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-primary2 font-playfair">
                🔥 تُخبز يوميًا
                </p>
                <p className="text-xs text-muted-foreground font-cairo">
                طازجة من الفرن
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 md:h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl"></div>
            <Image
              src="/hero.png"
              alt="مخبز أم علي المميز"
              fill
              className="object-cover rounded-3xl shadow-2xl"
              priority
            />

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-xl border border-border w-48"
            >
              <p className="font-cairo text-sm text-foreground font-semibold">
             لذّة تُخبز يوميًا
             🍞
              </p>
              <div className="flex gap-2 mt-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                <div className="w-8 h-8 bg-accent/20 rounded-full"></div>
                <div className="w-8 h-8 bg-secondary/20 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mt-20"
        >
          <ArrowDown className="text-primary opacity-50" size={24} />
        </motion.div>
      </div>
    </section>
  );
}
