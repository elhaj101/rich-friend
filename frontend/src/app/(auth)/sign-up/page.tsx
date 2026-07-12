import type { Metadata } from "next";
import AuthForm from "../AuthForm";

export const metadata: Metadata = {
  title: "Become a member — Rich Friend",
  description: "Create your private Rich Friend concierge account.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
