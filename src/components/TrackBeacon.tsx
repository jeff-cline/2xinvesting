"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fires a pageview on every route change so the God dashboard can reconstruct each visitor's click-path.
export default function TrackBeacon() {
  const path = usePathname();
  useEffect(() => {
    fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "pageview", page: path }) }).catch(() => {});
  }, [path]);
  return null;
}
