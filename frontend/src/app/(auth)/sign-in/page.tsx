import type { Metadata } from "next";
import AuthForm from "../AuthForm";

export const metadata: Metadata = {
  title: "Sign in — Rich Friend",
  description: "Sign in to your Rich Friend concierge account.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
