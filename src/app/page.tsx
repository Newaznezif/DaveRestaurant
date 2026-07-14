import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to dashboard if authenticated, otherwise to login
  // This will be handled by middleware in production
  redirect("/login");
}