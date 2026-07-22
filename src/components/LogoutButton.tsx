"use client";
export default function LogoutButton() {
  return <button className="btn ghost" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }}>Sign out</button>;
}
