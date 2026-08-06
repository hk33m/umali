"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  X,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";

// استيراد مكونات shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductManager() {
  // ==========================================
  // حالات الواجهة العامة (List vs Form)
  // ==========================================
  const [currentView, setCurrentView] = useState("list"); // "list" | "form"
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ==========================================
  // حالات النموذج (Form States)
  // ==========================================
  const [editingId, setEditingId] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState({
    file: null,
    preview: null,
    existingUrl: null,
  });
  const mainImageRef = useRef(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const galleryRef = useRef(null);

  const initialFormState = {
    name: "",
    slug: "",
    description: "",
    product_type: "",
    badge_text: "",
    price: "",
    is_available: true,
    sort_order: 0,
  };
  const [formData, setFormData] = useState(initialFormState);

  // ==========================================
  // دوال جلب البيانات من الخادم
  // ==========================================
  const fetchProducts = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || data.products || []);
      }
    } catch (err) {
      console.error("خطأ في جلب المنتجات:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // تنظيف الروابط المحلية للصور عند الخروج
  useEffect(() => {
    return () => {
      if (mainImage.preview && !mainImage.existingUrl)
        URL.revokeObjectURL(mainImage.preview);
      galleryImages.forEach((img) => {
        if (img.preview && !img.existingUrl) URL.revokeObjectURL(img.preview);
      });
    };
  }, [mainImage, galleryImages]);

  // ==========================================
  // دوال التفاعل مع القائمة (List Actions)
  // ==========================================
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setMainImage({ file: null, preview: null, existingUrl: null });
    setGalleryImages([]);
    setSuccess(false);
    setError("");
    setCurrentView("form");
  };

  const handleEditClick = async (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      product_type: product.product_type || "",
      badge_text: product.badge_text || "",
      price: product.price,
      is_available: product.is_available === 1 || product.is_available === true,
      sort_order: product.sort_order || 0,
    });

    // تعيين الصورة الرئيسية الحالية
    if (product.image) {
      setMainImage({
        file: null,
        preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`,
        existingUrl: true,
      });
    }

    setCurrentView("form");

    // جلب الصور الفرعية للمنتج
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`
      );
      const data = await res.json();
      if (data.success && data.gallery) {
        const existingGallery = data.gallery.map((imgPath) => ({
          file: null,
        
          preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${imgPath}`, 
          
          path: imgPath, 
          
          existingUrl: true,
          id: Math.random().toString(36).substr(2, 9),
        }));
        setGalleryImages(existingGallery);
      }
    } catch (error) {
      console.error("خطأ في جلب تفاصيل المنتج:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.success) {
        fetchProducts(); // تحديث القائمة
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  // ==========================================
  // دوال التعامل مع الصور والنموذج
  // ==========================================
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (mainImage.preview && !mainImage.existingUrl)
        URL.revokeObjectURL(mainImage.preview);
      setMainImage({
        file,
        preview: URL.createObjectURL(file),
        existingUrl: false,
      });
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        existingUrl: false,
        id: Math.random().toString(36).substr(2, 9),
      }));
      setGalleryImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeGalleryImage = (idToRemove) => {
    setGalleryImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === idToRemove);
      if (imageToRemove && !imageToRemove.existingUrl)
        URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter((img) => img.id !== idToRemove);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    setSuccess(false);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (mainImage.file) submitData.append("image", mainImage.file);

      // 3. إرسال مسارات الصور الفرعية القديمة (التي لم يتم حذفها)
      const keptExistingImages = galleryImages.filter(img => img.existingUrl);
      keptExistingImages.forEach(img => {
        submitData.append("existingGallery", img.path);
      });

      // نرسل فقط الملفات الجديدة للمعرض
      const newGalleryFiles = galleryImages.filter((img) => !img.existingUrl);
      newGalleryFiles.forEach((img) => {
        submitData.append("gallery", img.file);
      });

      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: submitData });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        fetchProducts(); // تحديث القائمة في الخلفية
        if (!editingId) {
          // تفريغ النموذج فقط في حالة الإضافة
          setFormData(initialFormState);
          setMainImage({ file: null, preview: null, existingUrl: null });
          setGalleryImages([]);
        }
        setTimeout(() => setCurrentView("list"), 1500); // العودة للقائمة بعد ثانية ونصف
      } else {
        setError(data.message || "حدث خطأ أثناء حفظ المنتج");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم. تأكد من تشغيل الباك اند.");
    } finally {
      setLoadingForm(false);
    }
  };

  // فلترة المنتجات للعرض
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || product.product_type === filterType;
    return matchesSearch && matchesType;
  });

  // ==========================================
  // التصيير (Render)
  // ==========================================
  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 bg-slate-50 font-sans text-right"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العرض الأول: قائمة المنتجات */}
        {currentView === "list" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  إدارة المنتجات
                </h1>
                <p className="text-slate-500 mt-1">
                  عرض، إضافة، تعديل وحذف منتجات المتجر.
                </p>
              </div>
              <Button
                onClick={handleAddNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <Plus size={18} /> إضافة منتج جديد
              </Button>
            </div>

            {/* شريط الفلترة والبحث */}
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <Input
                    placeholder="ابحث عن منتج بالاسم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="w-full md:w-64 flex items-center gap-2">
                  <Filter className="text-slate-400" size={18} />
                  <Select
                    value={filterType}
                    onValueChange={setFilterType}
                    dir="rtl"
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="تصفية حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التصنيفات</SelectItem>
                      <SelectItem value="Bread">خبز</SelectItem>
                      <SelectItem value="Toast">توست</SelectItem>
                      <SelectItem value="Croissant">كرواسون</SelectItem>
                      <SelectItem value="Cake">كيك</SelectItem>
                      <SelectItem value="Pastry">معجنات أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* جدول / شبكة المنتجات */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                      <th className="p-4 font-semibold">المنتج</th>
                      <th className="p-4 font-semibold">التصنيف</th>
                      <th className="p-4 font-semibold">السعر</th>
                      <th className="p-4 font-semibold text-center">الحالة</th>
                      <th className="p-4 font-semibold text-center">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingList ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-slate-500"
                        >
                          <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />
                          جاري التحميل...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-slate-500"
                        >
                          لا توجد منتجات مطابقة للبحث.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden flex-shrink-0">
                                {product.image ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}uploads/products/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-6 h-6 m-auto mt-3 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-900">
                                  {product.name}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-[200px] truncate">
                                  {product.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {product.product_type}
                          </td>
                          <td className="p-4 font-medium text-indigo-600">
                            {product.price} ر.ي
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.is_available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {product.is_available ? "متوفر" : "مخفي"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(product)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Edit size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* العرض الثاني: نموذج الإضافة والتعديل */}
        {currentView === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentView("list")}
                className="flex items-center gap-2"
              >
                <ArrowRight size={18} /> العودة للقائمة
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h1>
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {editingId
                    ? "تم تعديل المنتج بنجاح!"
                    : "تم إضافة المنتج بنجاح!"}
                </span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* هنا نضع نفس الـ Form السابق الخاص بك تماماً */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        المعلومات الأساسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            اسم المنتج <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">
                            الرابط المخصص (Slug){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            required
                            className="text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">وصف المنتج</Label>
                        <Textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="text-right resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        التسعير والتصنيف
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">
                            السعر (ريال يمني){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            required
                            className="text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="product_type">نوع المنتج</Label>
                          <Select
                            value={formData.product_type}
                            onValueChange={(val) =>
                              setFormData({ ...formData, product_type: val })
                            }
                            dir="rtl"
                          >
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bread">خبز</SelectItem>
                              <SelectItem value="Toast">توست</SelectItem>
                              <SelectItem value="Croissant">كرواسون</SelectItem>
                              <SelectItem value="Cake">كيك</SelectItem>
                              <SelectItem value="Pastry">
                                معجنات أخرى
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="badge_text">نص الشارة (Badge)</Label>
                          <Input
                            id="badge_text"
                            name="badge_text"
                            placeholder="مثال: جديد"
                            value={formData.badge_text}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                badge_text: e.target.value,
                              })
                            }
                            className="text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sort_order">ترتيب العرض</Label>
                          <Input
                            id="sort_order"
                            name="sort_order"
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sort_order: e.target.value,
                              })
                            }
                            className="text-right"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-xl">الصورة الرئيسية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${mainImage.preview ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                        onClick={() => mainImageRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={mainImageRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />

                        {mainImage.preview ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={mainImage.preview}
                              alt="Main Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-200">
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">
                              اضغط لرفع صورة
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center justify-between">
                        الصور الفرعية
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => galleryRef.current?.click()}
                        >
                          <Plus className="w-4 h-4 ml-1" /> صور
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <input
                        type="file"
                        ref={galleryRef}
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleGalleryChange}
                      />

                      {galleryImages.length === 0 ? (
                        <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 bg-slate-50/50">
                          لا توجد صور فرعية مضافة.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <AnimatePresence>
                            {galleryImages.map((img) => (
                              <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                              >
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(img.id)}
                                  className="absolute top-2 right-2 z-10 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <img
                                  src={img.preview}
                                  alt="Gallery Preview"
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-xl">حالة المنتج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">
                            التوفر في المتجر
                          </Label>
                          <p className="text-sm text-slate-500">
                            {formData.is_available ? "معروض للبيع" : "مخفي"}
                          </p>
                        </div>
                        <Switch
                          checked={formData.is_available}
                          onCheckedChange={(val) =>
                            setFormData({ ...formData, is_available: val })
                          }
                          dir="ltr"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button
                        type="submit"
                        className="w-full h-12 text-lg font-medium shadow-md transition-all hover:shadow-lg"
                        disabled={loadingForm}
                      >
                        {loadingForm ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="ml-2 h-5 w-5" /> حفظ المنتج
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
