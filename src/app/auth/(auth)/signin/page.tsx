import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio de sesión",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template"
};

export default function SignIn() {
  return <SignInForm />;
}
