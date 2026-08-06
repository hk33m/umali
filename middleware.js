import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. جلب المسار الحالي
  const path = request.nextUrl.pathname;
  
  // 2. التحقق مما إذا كان المسار يخص لوحة التحكم
  if (path.startsWith('/admin')) {
    const isLoginPage = path === '/admin/login';
    
    // 3. جلب التوكن من الجلسة (الكوكيز)
    const token = request.cookies.get('adminToken')?.value;

    // 4. إذا لم يكن هناك توكن والمسار ليس صفحة الدخول -> اطرد المستخدم لصفحة الدخول
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 5. إذا كان هناك توكن والمدير يحاول الدخول لصفحة Login -> وجهه للوحة التحكم مباشرة
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // السماح بالمرور إذا كانت الشروط سليمة
  return NextResponse.next();
}

// تحديد المسارات التي سيعمل عليها هذا الـ Middleware
export const config = {
  matcher: ['/admin/:path*'],
};