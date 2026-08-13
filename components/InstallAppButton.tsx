"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // التحقق هل التطبيق مفتوح كتطبيق مثبت
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // انتظار توفر نافذة التثبيت
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();

      setDeferredPrompt(event);
    };

    // عند اكتمال تثبيت التطبيق
    const handleAppInstalled = () => {
      console.log("✅ App installed");

      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log("Install result:", outcome);

    setDeferredPrompt(null);
  };

  // إذا كان التطبيق مثبتًا لا نظهر الزر
  if (isInstalled) {
    return null;
  }

  // إذا لم يكن Chrome جاهزًا للتثبيت لا نظهر الزر
  if (!deferredPrompt) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-2 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
    >
      <Download className="size-3" />
      تثبيت التطبيق
    </button>
  );
}