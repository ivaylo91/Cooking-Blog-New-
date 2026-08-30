"use client";

import Image from "next/image";
import { useState } from "react";
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

  return (
    <div>
      {previewUrl && (
        <div className="relative mb-2 h-32 w-48 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
          <Image src={previewUrl} alt="" fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="text-sm"
      />
      {uploading && <p className="mt-1 text-xs text-zinc-500">Качване...</p>}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
