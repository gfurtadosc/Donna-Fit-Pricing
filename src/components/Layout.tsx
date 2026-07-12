import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-cream">
      <Header />
      <main className="flex flex-1 flex-col px-6 py-6">{children}</main>
    </div>
  );
}
