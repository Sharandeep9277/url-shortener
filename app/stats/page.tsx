"use client";

import { useEffect, useState } from "react";

interface Link {
  code: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export default function StatsPage() {
  const [links, setLinks] =
    useState<Link[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadLinks() {
      try {
        const response = await fetch(
          "/api/links"
        );

        const data = await response.json();

        setLinks(data.data ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadLinks();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Link Statistics
        </h1>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">
                  Code
                </th>

                <th className="text-left p-4">
                  Original URL
                </th>

                <th className="text-left p-4">
                  Clicks
                </th>

                <th className="text-left p-4">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {links.map((link) => (
                <tr
                  key={link.code}
                  className="border-b"
                >
                  <td className="p-4">
                    {link.code}
                  </td>

                  <td className="p-4 max-w-md truncate">
                    {link.originalUrl}
                  </td>

                  <td className="p-4 font-bold">
                    {link.clicks}
                  </td>

                  <td className="p-4">
                    {new Date(
                      link.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}