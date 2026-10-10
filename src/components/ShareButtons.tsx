"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Link2, Share2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faViber, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function noopSubscribe() {
  return () => {};
}

const item =
  "flex h-12 w-full items-center gap-3 border-b border-border-subtle px-4 text-left font-heading text-lg font-bold uppercase tracking-wide transition-colors last:border-b-0 hover:bg-surface-muted";

/**
 * Sharing folded into one control. Four destinations side by side used to
 * outrank the recipe; behind "Сподели" they are there when wanted.
 */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="share-menu"
        className="flex h-11 items-center gap-2 border-2 border-rule px-3 font-heading text-lg font-bold uppercase tracking-wide transition-colors hover:bg-surface-muted"
      >
        <Share2 size={18} strokeWidth={2.5} />
        Сподели
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id="share-menu"
          className="absolute right-0 top-full z-20 mt-2 w-64 border-2 border-rule bg-background"
        >
          {canNativeShare && (
            <button type="button" onClick={handleNativeShare} className={item}>
              <Share2 size={18} strokeWidth={2.5} /> Сподели от телефона
            </button>
          )}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={item}
          >
            <FontAwesomeIcon icon={faFacebookF} className="w-[18px]" /> Facebook
          </a>
          <a href={`viber://forward?text=${encodedText}%20${encodedUrl}`} className={item}>
            <FontAwesomeIcon icon={faViber} className="w-[18px]" /> Viber
          </a>
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={item}
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-[18px]" /> WhatsApp
          </a>
          <button type="button" onClick={handleCopy} className={item} aria-live="polite">
            {copied ? <Check size={18} strokeWidth={2.75} /> : <Link2 size={18} strokeWidth={2.5} />}
            {copied ? "Копирано" : "Копирай линк"}
          </button>
        </div>
      )}
    </div>
  );
}
