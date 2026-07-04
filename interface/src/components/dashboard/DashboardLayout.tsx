import type { ReactNode } from "react";
import Sidebar from "../shared/Sidebar";
import TopNav from "../shared/TopNav";

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
        className={`flex-1 md:ml-56 flex flex-col relative w-full ${fullHeight ? "h-screen" : "min-h-screen"}`}
      >
        {/* Desktop & Mobile TopNav */}
        <TopNav />

        {/* Scrollable Content Canvas */}
        <div
          className={
            fullHeight
              ? "flex-1 flex flex-col overflow-hidden w-full"
              : "pt-8 px-margin-mobile md:px-margin-desktop pb-24 max-w-max-width mx-auto w-full space-y-gutter flex-1"
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
}
