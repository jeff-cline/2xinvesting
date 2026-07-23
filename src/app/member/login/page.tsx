import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import MemberAuth from "@/components/MemberAuth";
import { getSessionMember } from "@/lib/member-auth";
export const dynamic = "force-dynamic";
export default async function MemberLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSessionMember()) redirect(next || "/member");
  return (<><Header /><main><div className="wrap" style={{ padding: "56px 0" }}><MemberAuth next={next || "/member"} /></div></main><Footer /></>);
}
