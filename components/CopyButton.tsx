"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
}

export default function CopyButton({
  value,
}: CopyButtonProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="border rounded px-3 py-2"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}