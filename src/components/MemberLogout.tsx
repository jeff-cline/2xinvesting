"use client";
export default function MemberLogout() {
  return <button className="ml-nav-btn" onClick={async () => { await fetch("/api/member/logout", { method: "POST" }); location.href = "/"; }}>Sign out</button>;
}
