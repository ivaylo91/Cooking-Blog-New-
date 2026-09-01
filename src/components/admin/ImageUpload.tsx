"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/images";

export function ImageUpload({
  path,
  onChange,
  folder,
}: {
  path: string | null;
  onChange: (path: string | null) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = getImageUrl(path);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const objectPath = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(objectPath, file, { upsert: false });
      if (uploadError) throw uploadError;
      onChange(objectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Качването е неуспешно.");
    } finally {
      setUploading(false);
    }
  }

  if (previewUrl) {
    return (
      <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-border-subtle bg-surface-muted sm:h-48">
        <Image src={previewUrl} alt="" fill className="object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition hover:bg-destructive-soft hover:text-destructive"
          aria-label="Премахни снимката"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex h-40 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition sm:h-48 ${
          dragActive
            ? "border-accent bg-accent-soft"
            : "border-border-subtle hover:border-accent hover:bg-accent-soft/40"
        }`}
      >
        {uploading ? (
          <Loader2 size={22} className="animate-spin text-accent" />
        ) : (
          <ImageUp size={22} className="text-muted-foreground" />
        )}
        <span className="px-4 text-sm font-medium">
          {uploading ? "Качване..." : "Качи снимка"}
        </span>
        {!uploading && (
          <span className="text-xs text-muted-foreground">или пуснете файл тук</span>
        )}
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="sr-only"
        />
      </label>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
