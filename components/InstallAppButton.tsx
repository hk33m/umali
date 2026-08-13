"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      console.log("🔥 beforeinstallprompt FIRED");

      event.preventDefault();

      setDeferredPrompt(event);
      setIsReady(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    console.log("👀 Install button initialized");

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    console.log("🟢 Install button clicked");

    if (!deferredPrompt) {
      console.log("❌ deferredPrompt is NULL");
      return;
    }

    await deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("📱 Install result:", result.outcome);

    setDeferredPrompt(null);
    setIsReady(false);
  };

  // مؤقتًا: أظهر الزر دائمًا
  return (
    <button
      type="button"
      onClick={handleInstall}
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
    >
      <Download className="size-4" />
      تثبيت التطبيق
    </button>
  );
}