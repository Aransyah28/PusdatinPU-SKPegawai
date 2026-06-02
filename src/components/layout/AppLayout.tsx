import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import Footer from "./footer";
import type { User } from "@/lib/auth/auth";

interface AppLayoutProps {
  children: ReactNode;
  user: User | null;
}

export function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-20">
      <Navbar user={user} />
      
      {/* Main Content Area */}
      <main className="flex-1 section-padding mx-auto w-full max-w-[1600px]">
        {children}
      </main>

      <Footer />
    </div>
  );
}
