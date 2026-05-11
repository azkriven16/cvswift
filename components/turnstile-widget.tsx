"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

type TurnstileWidgetProps = {
  sitekey: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  size?: "normal" | "compact";
};

export function TurnstileWidget({ sitekey, onToken, onExpire, size = "normal" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);

  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;

  useEffect(() => {
    const SCRIPT_ID = "cf-turnstile-script";

    function renderWidget() {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => { onExpireRef.current?.(); widgetIdRef.current = null; },
        "error-callback": () => { onExpireRef.current?.(); widgetIdRef.current = null; },
        theme: "auto",
        size,
      });
    }

    if (document.getElementById(SCRIPT_ID)) {
      renderWidget();
    } else {
      window.onTurnstileLoad = renderWidget;
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [sitekey, size]);

  return <div ref={containerRef} />;
}
