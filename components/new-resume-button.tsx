"use client";

import { FilePlus2 } from "lucide-react";
import { useState } from "react";

export function NewResumeButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Resume" }),
    });
    const data = (await res.json()) as { resume?: { id?: string }; error?: string };
    if (data.resume?.id) {
      window.location.href = `/app/resumes/${data.resume.id}`;
    } else {
      console.error("[new-resume]", data.error);
      alert(data.error ?? "Could not create resume.");
      setLoading(false);
    }
  }

  return (
    <button type="button" className={className} onClick={create} disabled={loading}>
      <FilePlus2 size={16} />
      {loading ? "Creating..." : "New resume"}
    </button>
  );
}
