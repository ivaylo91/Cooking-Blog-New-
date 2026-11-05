"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Link2, Share2 } from "lucide-react";
import { FacebookIcon, ViberIcon, WhatsAppIcon } from "@/components/BrandIcons";

function noopSubscribe() {
  return () => {};
}

const item =
  "flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left font-medium transition-colors hover:bg-surface-muted";

/**
 * Sharing folded into one control. Four destinations side by side used to
 * outrank the recipe; behind "Сподели" they are there when wanted.
 *
 * It lays out its own action row, so the phone menu can span the whole row
 * wherever the button sits; `children` are the controls before it (print).
 */
export function ShareButtons({
  title,
  url,
  children,
  className = "",
}: {
  title: string;
  url: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled the share sheet: nothing to do
    }
    setOpen(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {children}
      <div ref={rootRef} className="sm:relative">
        <button
          ref={toggleRef}
          type="button"
          // Where the phone has its own share sheet, one tap opens it: it
          // already lists Viber, WhatsApp and the rest.
          onClick={() => (canNativeShare ? handleNativeShare() : setOpen((v) => !v))}
          // A disclosure only when it opens our own menu.
          aria-expanded={canNativeShare ? undefined : open}
          aria-controls={canNativeShare ? undefined : "share-menu"}
          className="flex min-h-11 items-center gap-2 rounded-full bg-surface-muted px-4 py-2 font-semibold transition-colors hover:bg-border-subtle"
        >
          <Share2 size={18} aria-hidden="true" />
          Сподели
          {!canNativeShare && (
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open && (
          <div
            id="share-menu"
            // On a phone it spans the action row, anchored to the row itself, so
            // it can't run off screen wherever the button sits. Above the sticky
            // tab bar (z-30), below the site header (z-40).
            className="animate-rise absolute inset-x-0 top-full z-[35] mt-2 rounded-2xl border border-border-subtle bg-surface p-1.5 shadow-lift sm:inset-x-auto sm:left-0 sm:w-64"
          >
            {canNativeShare && (
              <button type="button" onClick={handleNativeShare} className={item}>
                <Share2 size={18} /> Сподели от телефона
              </button>
            )}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={item}
            >
              <FacebookIcon className="size-[18px]" /> Facebook
            </a>
            <a href={`viber://forward?text=${encodedText}%20${encodedUrl}`} className={item}>
              <ViberIcon className="size-[18px]" /> Viber
            </a>
            <a
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={item}
            >
              <WhatsAppIcon className="size-[18px]" /> WhatsApp
            </a>
            <button type="button" onClick={handleCopy} className={item} aria-live="polite">
              {copied ? <Check size={18} /> : <Link2 size={18} />}
              {copied ? "Копирано" : "Копирай линк"}
            </button>
            {copyFailed && (
              <p role="status" className="px-3 pb-2 pt-1 text-small text-destructive-strong">
                Копирането не стана. Копирайте адреса от лентата на браузъра.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
