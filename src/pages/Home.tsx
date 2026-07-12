import { useState } from "react";
import Header from "../components/Header";
import NavButton from "../components/NavButton";

const NAV_ITEMS = [
  { to: "/precificar", label: "Precificar", variant: "primary" as const },
  { to: "/ingredientes", label: "Ingredientes", variant: "secondary" as const },
  { to: "/receitas", label: "Minhas Receitas", variant: "secondary" as const },
];

export default function Home() {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-mist">
      <Header animateIntro onSettled={() => setShowButtons(true)} />

      <main className="flex flex-1 flex-col justify-center gap-4 px-6 py-6">
        {NAV_ITEMS.map((item, index) => (
          <div
            key={item.to}
            className={`transition-all duration-500 ease-out ${
              showButtons ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: showButtons ? `${index * 150}ms` : "0ms" }}
          >
            <NavButton to={item.to} label={item.label} variant={item.variant} />
          </div>
        ))}
      </main>
    </div>
  );
}
