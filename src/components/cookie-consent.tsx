"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (personalized: boolean) => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        analytics: true,
        personalizedAds: personalized,
        timestamp: new Date().toISOString(),
      })
    );
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg md:border">
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience and show relevant ads.
        You can choose to accept all cookies or only essential ones.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => accept(true)}>
          Accept All
        </Button>
        <Button size="sm" variant="outline" onClick={() => accept(false)}>
          Essential Only
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        See our{" "}
        <a href="/cookie-policy" className="underline">Cookie Policy</a>{" "}
        and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
