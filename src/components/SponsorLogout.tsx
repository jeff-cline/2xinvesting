"use client";
export default function SponsorLogout() {
  return <button className="btn ghost" onClick={async () => { await fetch("/api/sponsor/logout", { method: "POST" }); location.href = "/"; }}>Sign out</button>;
}
