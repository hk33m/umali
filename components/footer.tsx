"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const footerLinks = [
    {
      title: "المنتجات",
      links: ["جميع المنتجات", "المنتجات الجديدة", "العروض", "المتجر"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-16 border-b border-background/10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-background font-playfair font-bold">
                    <img src="/logo.jpg" alt="Logo" className="rounded-full" />
                  </span>
                </div>
                <span className="font-playfair font-bold text-base md:text-lg ">
                  مخبز أم علي
                </span>
              </div>
              <p className="text-background/70 font-cairo text-sm md:text-base leading-relaxed mb-4">
                منتجات مخبز أم علي الفاخرة مصنوعة بأفضل المكونات الطبيعية
                وتقاليد الطبخ الشرقي الأصيلة.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Columns */}
            {footerLinks.map((column, columnIndex) => (
              <motion.div key={columnIndex} variants={itemVariants}>
                <h3 className="font-cairo font-semibold mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-background/70 hover:text-background transition-colors font-cairo text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-background/70 font-cairo text-sm">
            © {currentYear} مخبز أم علي. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:umalibakery26@gmail.com"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors font-cairo text-sm"
            >
              <Mail size={16} />
              البريد الإلكتروني
            </a>
            <a
              href="tel:+966123456789"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors font-cairo text-sm"
            >
              <Phone size={16} />
              الهاتف
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
