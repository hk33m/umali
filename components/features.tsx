"use client";

import { motion } from "framer-motion";
import { Home, Wheat, ChefHat, Flame } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Wheat,
      title: " البر الصحي ",
      description:
       "نختار البر الصحي بدل الدقيق الأبيض، لنقدم لك مخبوزات بطعم أصيل وخيار أقرب لما تحبه",
    },
    {
      icon: ChefHat,
      title: "بأيدي أمهات  ",
      description:"كل قطعة تُحضّر بعناية بأيدي أمهات يعرفن معنى أن يكون الطعام مصنوعًا بحب.",
    },
    {
      icon: Home,
      title: " نكهة البيت   ",
      description: "وصفات بطابع منزلي… لأننا نؤمن أن أجمل طعم هو الذي يشبه طعم البيت.",
    },
    {
      icon: Flame,
      title: "طازج كل يوم   ",
      description: "نخبز يوميًا لتصل إليك المخبوزات طازجة، طرية، وبأجمل نكهة.",
    },
    
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-primary font-cairo font-semibold text-sm mb-3">
            💎 لماذا تختار مخبز أم علي؟
          </p>
          <h2 className="font-playfair font-bold text-2xl md:text-4xl text-foreground mb-4">
   لأننا لا نريد أن نقدم لك مجرد مخبوزات
          </h2>
          <p className="text-muted-foreground font-cairo max-w-2xl mx-auto text-sm md:text:base">
نريد أن نقدم لك الطعم الذي يذكّرك بالبيت
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all duration-300 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
                >
                  <Icon  className="text-primary w-7 h-7 md:w-8" />
                </motion.div>
                <h3 className="font-playfair font-bold text-base md:text-lg text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-cairo text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Highlight Box */}
        
      </div>
    </section>
  );
}
