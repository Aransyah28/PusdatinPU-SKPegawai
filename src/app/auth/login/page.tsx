"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn.email({ email, password });

    if (error) {
      toast.error("Email atau password salah.");
      setIsLoading(false);
      return;
    }

    toast.success("Berhasil masuk!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-blue/30">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-title-lg text-heading">Masuk</h1>
          <p className="mt-1 text-body-sm text-body/60">Portal SK Kepegawaian Pusdatin PU</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormTextField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />

          <FormTextField
            label="Kata Sandi"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-body-md font-bold text-white shadow-md transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Masuk
          </button>
        </form>

        <p className="mt-5 text-center text-body-sm text-body/60">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
