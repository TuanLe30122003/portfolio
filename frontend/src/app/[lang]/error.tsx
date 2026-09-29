"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/client";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useI18n().messages.error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-svh place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold md:text-5xl">{t.title}</h1>
        <p className="mt-4 text-muted">{t.body}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink"
        >
          {t.retry}
        </button>
      </div>
    </section>
  );
}
