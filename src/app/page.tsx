import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return <Dashboard />;
}
