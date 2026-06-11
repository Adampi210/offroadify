"use client";

import { useEffect, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Offroadify
          </h1>
          <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            Upload a photo of your car and turn it into an off-road version.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <label
            htmlFor="car-image"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Car photo (JPG, PNG, or WebP)
          </label>
          <input
            id="car-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:file:bg-zinc-50 dark:file:text-black"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Original
          </h2>
          <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview of the selected car"
                className="max-h-[60vh] w-auto max-w-full rounded"
              />
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No image selected yet.
              </p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <button
            type="button"
            disabled
            className="h-12 cursor-not-allowed rounded-full bg-zinc-300 px-5 text-base font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
          >
            Generate off-road version
          </button>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Generation is not connected yet. This preview is local only — no
            image is uploaded anywhere.
          </p>
        </section>
      </main>
    </div>
  );
}
