"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Image as ImageIcon } from "lucide-react";

export default function OfferManager() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات النافذة المنبثقة (Modal) والنموذج
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: "",
    is_active: 1,
    start_date: "",
    end_date: "",
    image: null,
  });

  // جلب العروض من الـ API
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`);
      const data = await res.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error("خطأ في جلب العروض:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // فتح نافذة الإضافة
  const handleAddClick = () => {
    setEditingOffer(null);
    setFormData({ title: "", is_active: 1, start_date: "", end_date: "", image: null });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleEditClick = (offer) => {
    setEditingOffer(offer);
    // تحويل التواريخ لصيغة مناسبة لحقل input type="datetime-local" أو date
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // يكتفي بالتاريخ YYYY-MM-DD
    };

    setFormData({
      title: offer.title,
      is_active: offer.is_active,
      start_date: formatDateForInput(offer.start_date),
      end_date: formatDateForInput(offer.end_date),
      image: null, // لا نضع الصورة القديمة في حقل الملف
    });
    setIsModalOpen(true);
  };

  // إرسال البيانات (إضافة أو تعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // استخدام FormData لأننا نرسل ملف صورة
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("is_active", formData.is_active);
    submitData.append("start_date", formData.start_date);
    submitData.append("end_date", formData.end_date);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      const url = editingOffer 
        ? `${process.env.NEXT_PUBLIC_API_URL}/offers/${editingOffer.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/offers`;
        
      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchOffers(); // تحديث القائمة
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("خطأ في حفظ العرض:", error);
    }
  };

  // حذف عرض
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchOffers();
      }
    } catch (error) {
      console.error("خطأ في حذف العرض:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100" dir="rtl">
      {/* الترويسة وزر الإضافة */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة الإعلانات</h2>
          <p className="text-sm text-gray-500 mt-1">أضف، عدل، واحذف العروض الحصرية للمتجر</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          إضافة إعلان جديد
        </button>
      </div>

      {/* جدول عرض الإعلانات */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">الصورة</th>
              <th className="p-4 font-medium">العنوان</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium">تاريخ البداية</th>
              <th className="p-4 font-medium">تاريخ النهاية</th>
              <th className="p-4 font-medium text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">جاري التحميل...</td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">لا توجد إعلانات حالياً.</td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-20 h-12 relative rounded overflow-hidden bg-gray-100 border">
                      {offer.image ? (
                        // استخدام وسم img العادي بناءً على طلبك السابق
                        <img 
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/offers/${offer.image}`} 
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{offer.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {offer.is_active ? 'مفعل' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{new Date(offer.start_date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(offer.end_date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button onClick={() => handleEditClick(offer)} className="text-blue-500 hover:text-blue-700 transition-colors" title="تعديل">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(offer.id)} className="text-red-500 hover:text-red-700 transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* النافذة المنبثقة (Modal) للإضافة والتعديل */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingOffer ? "تعديل الإعلان" : "إضافة إعلان جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="مثال: خصم 20% على المخبوزات"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة الإعلان</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  required={!editingOffer} // مطلوب فقط عند الإضافة
                  className="w-full border border-gray-300 rounded-lg p-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                {editingOffer && (
                  <p className="text-xs text-gray-500 mt-1">اترك هذا الحقل فارغاً إذا كنت لا تريد تغيير الصورة الحالية.</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active === 1 || formData.is_active === true}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 accent-amber-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  تفعيل الإعلان (سيظهر في المتجر إذا كان التاريخ سارياً)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded-lg font-medium transition-colors"
                >
                  {editingOffer ? "حفظ التعديلات" : "إضافة الإعلان"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}