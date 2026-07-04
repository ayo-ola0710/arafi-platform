import type { ReactNode } from "react";
import Sidebar from "../shared/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

export default function DashboardLayout({
  children,
  fullHeight,
}: DashboardLayoutProps) {
  return (
    <div
      className={`font-body-md text-body-md antialiased flex bg-background text-on-surface ${fullHeight ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      {/* SideNavBar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 md:ml-64 flex flex-col relative w-full ${fullHeight ? "h-screen" : "min-h-screen"}`}
      >
        {/* TopNavBar (Mobile only) */}
        <nav className="md:hidden flex justify-between items-center px-margin-mobile h-16 bg-surface border-b border-outline-variant fixed top-8 w-full z-40">
          <div className="font-headline-md text-headline-md font-bold text-primary">
            Arafi
          </div>
          <button className="text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </nav>

        {/* Scrollable Content Canvas */}
        <div
          className={
            fullHeight
              ? "flex-1 flex flex-col overflow-hidden w-full"
              : "pt-24 md:pt-16 px-margin-mobile md:px-margin-desktop pb-24 max-w-max-width mx-auto w-full space-y-gutter flex-1"
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
}
