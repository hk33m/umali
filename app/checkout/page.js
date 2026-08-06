"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const clearCart = useCartStore((state) => state.clearCart);
  
  // تم إزالة واجهة TypeScript والاعتماد على كائن JS عادي
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  // إزالة أنواع TypeScript من الحدث
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateReceiptImage = async (customerInfo) => {
    const receiptHtml = `
      <div style="width: 600px; padding: 40px; background: white; font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; border: 2px solid #5a7d6f;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #5a7d6f; padding-bottom: 20px;">
          <h1 style="color: #5a7d6f; margin: 0; font-size: 32px;">مخبز أم علي المميز</h1>
          <p style="color: #a89968; margin: 5px 0 0 0; font-size: 14px;">طلب جديد</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0; font-size: 14px;"><strong>اسم العميل:</strong> ${customerInfo.customer_name}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>رقم الهاتف:</strong> ${customerInfo.phone}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>العنوان بالتفصيل:</strong> ${customerInfo.address}</p>
        </div>

        <div style="margin-bottom: 20px; border: 1px solid #e8e0d5; padding: 15px; border-radius: 8px;">
          <h2 style="color: #5a7d6f; font-size: 16px; margin: 0 0 15px 0;">تفاصيل الطلب</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f3f0; border-bottom: 2px solid #5a7d6f;">
                <th style="padding: 10px; text-align: right; font-size: 12px;">المنتج</th>
                <th style="padding: 10px; text-align: center; font-size: 12px;">الكمية</th>
                <th style="padding: 10px; text-align: center; font-size: 12px;">السعر</th>
                <th style="padding: 10px; text-align: center; font-size: 12px;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #e8e0d5;">
                  <td style="padding: 10px; text-align: right; font-size: 12px;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; font-size: 12px;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: center; font-size: 12px;">${item.price} ريال</td>
                  <td style="padding: 10px; text-align: center; font-size: 12px; font-weight: bold;">${item.price * item.quantity} ريال</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div style="background: #f5f3f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>المجموع الفرعي:</span>
            <span style="font-weight: bold;">${totalPrice} ريال</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>الشحن:</span>
            <span style="font-weight: bold; color: #a89968;">مجاني</span>
          </div>
          <div style="border-top: 2px solid #d4c4b0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 16px;">
            <span style="font-weight: bold;">الإجمالي:</span>
            <span style="font-weight: bold; color: #5a7d6f; font-size: 18px;">${totalPrice} ريال</span>
          </div>
        </div>

        ${
          customerInfo.notes
            ? `
          <div style="background: #fffaf5; padding: 15px; border-right: 4px solid #a89968; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; color: #5a7d6f; font-weight: bold; font-size: 12px;">ملاحظات العميل:</p>
            <p style="margin: 0; font-size: 13px; color: #2d2520;">${customerInfo.notes}</p>
          </div>
        `
            : ""
        }

        <div style="text-align: center; padding-top: 20px; border-top: 2px solid #e8e0d5; color: #7a6f66; font-size: 12px;">
          <p style="margin: 0;">شكراً لطلبك معنا</p>
          <p style="margin: 5px 0 0 0;">سيتم التواصل معك قريباً للتأكيد والتوصيل</p>
        </div>
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = receiptHtml;
    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
      document.body.removeChild(element);
      return canvas.toDataURL("image/jpeg", 0.95);
    } catch (error) {
      console.error("Error generating receipt:", error);
      document.body.removeChild(element);
      return null;
    }
  };

  const sendWhatsAppMessage = () => {
    let message = `مرحباً! لدي طلب جديد:\n\n`;
    message += `*بيانات العميل:* \n`;
    message += `الاسم: ${formData.customer_name}\n`;
    message += `الهاتف: ${formData.phone}\n`;
    message += `العنوان: ${formData.address}\n\n`;
    message += `*تفاصيل الطلب:*\n`;

    cartItems.forEach((item) => {
      message += `${item.name} × ${item.quantity} = ${item.price * item.quantity} ريال\n`;
    });

    message += `\n*الإجمالي: ${totalPrice} ريال* \n`;

    if (formData.notes) {
      message += `\nملاحظات: ${formData.notes}\n`;
    }

    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "967775591565";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        total: totalPrice,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("فشل في حفظ الطلب في قاعدة البيانات");

      const receiptImage = await generateReceiptImage(formData);
      if (receiptImage) setOrderReceipt(receiptImage);

      sendWhatsAppMessage();
      clearCart();
    } catch (error) {
      console.error("Error processing order:", error);
      alert("حدث خطأ أثناء معالجة طلبك، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (totalPrice === 0 && !orderReceipt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>سلتك فارغة</h1>
          <p className="text-muted-foreground mb-8">لا توجد منتجات في سلتك لإتمام شرائها</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white">العودة للمتجر</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderReceipt) {
    return (
      <div className="min-h-screen py-20 px-4" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold mb-4">تم تسجيل طلبك بنجاح!</h1>
          <p className="text-xl text-muted-foreground mb-8">يرجى تحميل الفاتورة وإرسالها لنا في الواتساب لتأكيد الطلب</p>
          
          <img src={orderReceipt} alt="Order Receipt" className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-8" />
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = orderReceipt;
                link.download = "fatoura.jpg";
                link.click();
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 px-8 rounded-lg text-lg flex gap-2"
            >
              <Download className="w-6 h-6" /> تحميل الفاتورة للواتساب
            </Button>
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 rounded-lg text-lg flex gap-2">
                <ArrowRight className="w-6 h-6" /> العودة للتسوق
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          إتمام الشراء
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">رقم الهاتف (واتساب)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg text-left"
                    placeholder="05xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">العنوان والمدينة بالتفصيل</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg"
                  placeholder="المدينة، الحي، الشارع، رقم المبنى"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg resize-none"
                  placeholder="أي طلبات خاصة..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl text-lg shadow-md"
              >
                {isSubmitting ? "جاري الحفظ..." : "تأكيد الطلب"}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pl-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ''}uploads/products/${item.image}`} alt={item.name}  className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">الكمية: {item.quantity}</p>
                      <p className="font-black text-primary">{item.price * item.quantity} ريال</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-gray-900">{totalPrice} ريال</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-black text-gray-900">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-primary">{totalPrice} ريال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}