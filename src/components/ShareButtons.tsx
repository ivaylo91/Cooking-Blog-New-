"use client";

import { useState, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faViber, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function noopSubscribe() {
  return () => {};
}

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );
  const [copied, setCopied] = useState(false);

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const iconLinkClass =
    "flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-sm transition hover:border-accent hover:text-accent";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare && (
        <button type="button" onClick={handleNativeShare} className={iconLinkClass} aria-label="Сподели">
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      )}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkClass}
        aria-label="Сподели във Facebook"
      >
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
      <a
        href={`viber://forward?text=${encodedText}%20${encodedUrl}`}
        className={iconLinkClass}
        aria-label="Сподели във Viber"
      >
        <FontAwesomeIcon icon={faViber} />
      </a>
      <a
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkClass}
        aria-label="Сподели в WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-xs font-medium transition hover:border-accent hover:text-accent"
      >
        <FontAwesomeIcon icon={faLink} />
        {copied ? "Копирано!" : "Копирай линк"}
      </button>
    </div>
  );
}
