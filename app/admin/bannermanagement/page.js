"use client";
import { useState, useEffect } from "react";

export default function Bannermanagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات النافذة المنبثقة (Modal) والنموذج
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null); // إذا كان null يعني "إضافة"، وإذا كان يحمل بيانات يعني "تعديل"
  
  // بيانات النموذج
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // حالة التحميل والإشعارات
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // 1. جلب البنرات عند تحميل الصفحة
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
      const data = await res.json();
      if (data.success) setBanners(data.banners);
    } catch (error) {
      console.error("خطأ في جلب البنرات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 2. فتح نافذة الإضافة
  const openAddModal = () => {
    setEditingBanner(null);
    setImageFile(null);
    setPreview("");
    setSortOrder(0);
    setIsActive(true);
    setMessage(null);
    setIsModalOpen(true);
  };

  // 3. فتح نافذة التعديل
  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setImageFile(null);
    // جلب رابط الصورة الحالية من السيرفر لمعاينتها
    setPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/banners/${banner.image}`);
    setSortOrder(banner.sort_order);
    setIsActive(banner.is_active === 1);
    setMessage(null);
    setIsModalOpen(true);
  };

  // 4. معالجة اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 5. حفظ البيانات (إضافة أو تعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من الصورة فقط في حالة الإضافة الجديدة
    if (!editingBanner && !imageFile) {
      setMessage({ type: "error", text: "الرجاء اختيار صورة للبنر." });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("sort_order", sortOrder);
    formData.append("is_active", isActive ? 1 : 0);

    try {
      const url = editingBanner 
        ? `${process.env.NEXT_PUBLIC_API_URL}/banners/${editingBanner.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/banners`;
      
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchBanners(); // تحديث القائمة بعد النجاح
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "تعذر الاتصال بالخادم." });
    } finally {
      setIsSaving(false);
    }
  };

  // 6. حذف بنر
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا البنر؟ لا يمكن التراجع عن هذا الإجراء.")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        setBanners(banners.filter(b => b.id !== id)); // إزالة البنر من الواجهة مباشرة
      } else {
        alert("فشل الحذف: " + data.message);
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس الصفحة */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إدارة البنرات</h1>
            <p className="text-gray-500 text-sm mt-1">تحكم في الصور المعروضة في الصفحة الرئيسية</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            إضافة بنر جديد
          </button>
        </div>

        {/* قائمة البنرات (Grid) */}
        {loading ? (
          <div className="text-center py-20 text-amber-500 font-bold animate-pulse">جاري تحميل البنرات...</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">لا توجد بنرات حالياً. قم بإضافة بنر جديد!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                {/* صورة البنر */}
                <div className="h-48 bg-gray-100 relative">
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/banners/${banner.image}`} alt="Banner" className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {banner.is_active ? 'نشط' : 'معطل'}
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                    ترتيب: {banner.sort_order}
                  </div>
                </div>
                
                {/* أزرار التحكم */}
                <div className="p-4 flex gap-2">
                  <button onClick={() => openEditModal(banner)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl transition-colors text-sm border border-gray-200">
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl transition-colors text-sm border border-red-100">
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* النافذة المنبثقة (Modal) للإضافة والتعديل */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{editingBanner ? 'تعديل البنر' : 'إضافة بنر جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {message && (
                <div className={`p-3 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              {/* رفع الصورة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">صورة البنر {(!editingBanner) && <span className="text-red-500">*</span>}</label>
                <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden group">
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img src={preview} alt="معاينة" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-lg">تغيير الصورة</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span className="text-sm">اضغط لرفع صورة</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* الترتيب والحالة */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ترتيب العرض</label>
                  <input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="block text-sm font-bold text-gray-700 mb-2">حالة البنر</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isActive ? 'bg-amber-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? '-translate-x-1' : '-translate-x-7'}`} />
                    </button>
                    <span className="text-sm font-semibold text-gray-600">{isActive ? 'نشط' : 'معطل'}</span>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">إلغاء</button>
                <button type="submit" disabled={isSaving} className={`px-6 py-2.5 rounded-xl text-white font-bold transition-all ${isSaving ? 'bg-amber-400' : 'bg-amber-500 hover:bg-amber-600'}`}>
                  {isSaving ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* إضافة كلاس للأنيميشن في ملف global.css (اختياري لجمالية أكثر) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
      `}} />
    </div>
  );
}