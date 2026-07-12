import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-cream">
      <Header title={title} />
      <main className="flex flex-1 flex-col px-6 py-6">{children}</main>
    </div>
  );
}
