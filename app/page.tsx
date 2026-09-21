"use client";

import { FormEvent, useState } from "react";
import CopyButton from "@/components/CopyButton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch(
        "/api/links",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            alias,
            expiresAt: expiresAt
              ? new Date(expiresAt).toISOString()
              : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ??
            "Failed to shorten URL"
        );
      }

      setShortUrl(data.data.shortUrl);
      setUrl("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-2">
          URL Shortener
        </h1>

        <p className="text-gray-500 mb-8">
          Turn long URLs into short links.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="url"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            placeholder="https://example.com/very/long/url"
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Custom alias (optional)"
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg p-3 bg-black text-white disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Shorten URL"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Your short URL
            </p>

            <a
              href={shortUrl}
              target="_blank"
              className="text-blue-600 break-all"
            >
              {shortUrl}
            </a>

            <CopyButton value={shortUrl}/>
          </div>
        )}
      </div>
    </main>
  );
}