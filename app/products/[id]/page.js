"use client";
import { useState, useEffect } from "react";
import { useParams,useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";
import { ArrowRight ,ArrowLeft} from "lucide-react";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
   const router = useRouter();
  
  // 1. إضافة حالة للتحكم في الكمية
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
          setGallery(data.gallery || []);
          setMainImage(data.product.image); 
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // دوال زيادة ونقصان الكمية
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-amber-500 animate-pulse">جاري تحميل أشهى المنتجات...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500 font-semibold bg-white p-8 rounded-2xl shadow-sm">المنتج غير موجود</div>
      </div>
    );
  }

  return (
    // خلفية الصفحة رمادية فاتحة لكي تبرز البطاقة البيضاء
    <>
      <Header></Header>
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 font-sans text-gray-800 mt-16"  dir="rtl">
      <div className="container mx-auto max-w-6xl">
        
        {/* بطاقة المنتج الأساسية */}
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
          
          {/* ================= قسم الصور ================= */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* الصورة الكبيرة المحددة */}
            <div className="w-full h-80 md:h-[450px] bg-gray-50 rounded-2xl overflow-hidden shadow-inner mb-6 border border-gray-100 relative group">
              <img 
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${mainImage}`} 
                alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* معرض الصور الفرعية (Thumbnails) */}
            <div className="flex gap-4 overflow-x-auto p-2 w-full justify-center scrollbar-hide">
              {/* الصورة الأساسية */}
              <button 
                onClick={() => setMainImage(product.image)}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === product.image ? 'border-amber-500 shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
              >
                <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`} className="w-full h-full object-cover bg-gray-50" alt="Main" />
              </button>

              {/* باقي الصور الملحقة */}
              {gallery.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img ? 'border-amber-500 shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${img}`} className="w-full h-full object-cover bg-gray-50" alt={`Gallery ${index}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ================= قسم تفاصيل المنتج ================= */}
          <div className="w-full md:w-1/2 flex flex-col justify-start py-4">
            
            {/* شارة توفر المنتج (اختيارية، تضيف لمسة احترافية) */}
            {product.is_available === 1 && (
              <div className="flex justify-between items-center ">
              <span className="inline-block bg-green-100 text-green-700 text-xs md:text-sm font-bold px-3 py-1 rounded-full  w-max">
                متوفر في المتجر
              </span>
        <button
      onClick={() => router.back()}
      className="flex text-sm items-center gap-2 px-2 py-1 rounded-lg border"
    >
      <ArrowLeft className="w-5 h-5" />
      رجوع
    </button>
    </div>
              
            )}

            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 leading-tight mt-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-6">
              <span className="text-lg md:text-xl font-black text-amber-500">{product.price}</span>
              <span className="text-xl font-bold text-gray-500 mt-2">ريال</span>
            </div>
            
            <div className="mb-10 flex-grow">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                وصف المنتج
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base bg-gray-50 p-4 rounded-xl border border-gray-100">
                {product.description || "لا يوجد وصف متاح لهذا المنتج حالياً. يُخبز بكل حب وعناية ليرضي ذائقتكم."}
              </p>
            </div>

            {/* ================= قسم الكمية وإضافة للسلة ================= */}
            <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold text-gray-700">الكمية:</span>
                
                {/* أزرار التحكم بالكمية */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                  <button 
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-800 font-bold text-xl hover:bg-amber-100 hover:text-amber-600 transition-colors shadow-sm"
                  >
                    +
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-gray-900">{quantity}</span>
                  <button 
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-800 font-bold text-xl hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    -
                  </button>
                </div>
              </div>

              {/* زر الإضافة للسلة */}
              <button 
                //  onClick={() => addToCart({ ...product, quantity })}
                 onClick={() => {
                         const existingItem = cartItems.find(
                           (item) => item.id === product.id,
                         );
  
                         if (existingItem) {
                           toast.info(`${product.name} موجود بالفعل في السلة`);
                         } else {
                           addToCart({ ...product, quantity });
                           toast.success(`${product.name} تم إضافته إلى السلة`);
                         }
                       }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-amber-500/30 active:scale-95 text-lg md:text-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                إضافة إلى السلة
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
      <Footer></Footer>
      </>
  );
}