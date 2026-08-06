"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);

  const cartCount = cartItems.length;

  const navItems = [
    { name: "الرئيسية", href: "/" },
    { name: "المنتجات", href: "/products" },
    { name: "المميزات", href: "/#features" },
    { name: "الآراء", href: "/#reviews" },
    { name: "اتصل بنا", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/30 backdrop-blur-md z-50 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-playfair font-bold text-lg">
                  <img src="/logo.jpg" alt="Logo" className="rounded-full" />
                </span>
              </div>
              <span className="font-playfair font-bold text-xl text-foreground hidden sm:inline">
                مخبز أم علي
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-foreground hover:text-primary transition-colors font-cairo text-sm"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/cart">
              <button
                className="relative p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card mb-6"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-foreground hover:text-primary transition-colors font-cairo py-2"
                >
                  {item.name}
                </a>
              ))}
                   
              {/* <Button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-cairo mt-4"
              >
                <ShoppingCart className="w-4 h-4 ml-2" />
                السلة ({cartCount})
              </Button> */}
         
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
