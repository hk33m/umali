"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: FaWhatsapp,
      title: "وتساب",
      content: "967772610256+",
      color: "bg-primary/10",
      url: "https://wa.me/967772610256",
    },
    {
      icon: Phone,
      title: "الهاتف",
      content: "967772610256+",
      color: "bg-primary/10",
      url: "tel:+967772610256",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      content: "umalibakery26@gmail.com",
      color: "bg-accent/10",
      url: "mailto:umalibakery26@gmail.com",
    },
    {
      icon: MapPin,
      title: "العنوان",
      content:" إب - السبل - فوق ون مول - جوار مدارس الضياء الرائدة الأهلية",
      color: "bg-secondary/10",
      url: "#",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-cairo font-semibold text-sm mb-3">
            📞 تواصل معنا
          </p>
          <h2 className="font-playfair font-bold text-2xl md:text-4xl text-foreground mb-4">
            نحن هنا لخدمتك
          </h2>
          <p className="text-muted-foreground font-cairo max-w-2xl mx-auto text-sm md:text-base">
            اتصل بنا أو أرسل لنا رسالة وسيرد عليك فريقنا في أقرب وقت ممكن
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                >
                  <Link href={info.url} className="flex gap-4">
                  <div
                    className={`${info.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="text-primary w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-base md:text-lg text-foreground mb-1">
                      {info.title}
                    </h3>
                    <p className="text-muted-foreground font-cairo text-sm md:text-base">
                      {info.content}
                    </p>
                  </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Decorative Element */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-playfair font-bold text-foreground mb-4">
                ساعات العمل
              </h4>
              <div className="space-y-2 font-cairo text-muted-foreground">
                <p>السبت - الخميس: 8:00 ص - 10:00 م</p>
                <p>الجمعة: 2:00 م - 10:00 م</p>
                {/* <p>الأحد: مغلق</p> */}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-cairo text-foreground font-semibold mb-2 text-sm md:text-base">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-cairo"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cairo text-foreground font-semibold mb-2 text-sm md:text-base">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-cairo"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-foreground font-semibold mb-2 text-sm md:text-base">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-cairo"
                    placeholder="+967-50-1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block font-cairo text-foreground font-semibold mb-2 text-sm md:text-base">
                  الرسالة
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-cairo resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-cairo h-12 text-base"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال الرسالة
              </Button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-center font-cairo"
                >
                  ✓ شكراً لك! سيتم الرد عليك في أقرب وقت
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
