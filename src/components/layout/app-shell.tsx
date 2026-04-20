"use client";

import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { PremiumListener } from "@/components/premium/premium-listener";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="relative hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
          <MobileSidebar />
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="Lance" className="h-5 w-5" />
            <span className="text-lg font-bold">Lance</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <PremiumListener />
      <WelcomeModal />
    </div>
  );
}
