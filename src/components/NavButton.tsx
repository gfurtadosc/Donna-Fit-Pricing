import { Link } from "react-router-dom";

interface NavButtonProps {
  to: string;
  label: string;
  variant?: "primary" | "secondary";
}

export default function NavButton({
  to,
  label,
  variant = "secondary",
}: NavButtonProps) {
  const variantClasses =
    variant === "primary"
      ? "bg-clay text-white"
      : "bg-sand text-sageDark";

  return (
    <Link
      to={to}
      className={`block w-full rounded-2xl px-6 py-5 text-center font-sans text-lg font-semibold shadow-sm transition-transform active:scale-[0.98] ${variantClasses}`}
    >
      {label}
    </Link>
  );
}
