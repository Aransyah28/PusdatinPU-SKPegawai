"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { FormTextField } from "@/components/shared/FormTextField";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      toast.error(
        error.message ?? "Gagal mendaftar. Coba gunakan email lain.",
      );
      setIsLoading(false);
      return;
    }

    toast.success("Akun berhasil dibuat! Silakan masuk.");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-blue/30">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-title-lg text-heading">Daftar Akun</h1>
          <p className="mt-1 text-body-sm text-body/60">
            Portal SK Kepegawaian Pusdatin PU
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormTextField
            label="Nama Lengkap"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
          />

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-body-md font-bold text-white shadow-md transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Buat Akun
          </button>
        </form>

        <p className="mt-5 text-center text-body-sm text-body/60">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
