"use client";

import { useEffect, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    setError(null);
    setResultUrl(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleGenerate() {
    if (!selectedFile || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/offroadify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Generation failed. Please try again.";
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          // Not JSON; keep the generic message.
        }
        setError(message);
        return;
      }

      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-8">
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
            Car photo (JPG, PNG, or WebP, max 5 MB)
          </label>
          <input
            id="car-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:file:bg-zinc-50 dark:file:text-black"
          />
        </section>

        <div className="grid gap-8 sm:grid-cols-2">
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

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Off-road version
            </h2>
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
              {resultUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultUrl}
                  alt="Generated off-road version of the selected car"
                  className="max-h-[60vh] w-auto max-w-full rounded"
                />
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isGenerating
                    ? "Generating your off-road version..."
                    : "No off-road version generated yet."}
                </p>
              )}
            </div>
            {resultUrl && (
              <a
                href={resultUrl}
                download="offroadified-car.png"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-base font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Download off-road image
              </a>
            )}
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating}
            className="h-12 rounded-full bg-zinc-900 px-5 text-base font-medium text-white enabled:cursor-pointer enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-zinc-50 dark:text-black dark:enabled:hover:bg-zinc-300 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
          >
            {isGenerating ? "Generating..." : "Generate off-road version"}
          </button>
          {!selectedFile && !error && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Select a car photo above to enable generation.
            </p>
          )}
          {isGenerating && (
            <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">
              This can take up to a minute. Keep this page open.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </section>

        <section
          aria-label="Prototype limitations"
          className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <p>Accepts JPG, PNG, and WebP images up to 5 MB.</p>
          <p>
            This early prototype applies one fixed off-road transformation
            style, so results may vary between runs.
          </p>
        </section>
      </main>
    </div>
  );
}
