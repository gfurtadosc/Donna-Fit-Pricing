interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Donna Fit" }: HeaderProps) {
  return (
    <header className="w-full bg-sage px-6 py-5 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-white">
        {title}
      </h1>
    </header>
  );
}
