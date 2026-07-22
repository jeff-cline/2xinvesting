import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import SponsorLogin from "@/components/SponsorLogin";
import { getSessionSponsor } from "@/lib/sponsor-auth";
export const dynamic = "force-dynamic";
export default async function SponsorLoginPage() {
  if (await getSessionSponsor()) redirect("/portal");
  return (<><Header /><main><div className="wrap" style={{ padding: "60px 0" }}><SponsorLogin /></div></main><Footer /></>);
}
