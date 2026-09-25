import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Shell({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-orange-400">AI clip</p>
        {title ? <h1 className="text-lg font-semibold">{title}</h1> : null}
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      <footer className="border-t border-zinc-800 px-4 py-3 text-center text-[11px] text-zinc-500">
        AI-generated preview. EU Art. 50 label.
      </footer>
    </div>
  );
}

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg shadow-black/30">
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: BtnProps) {
  const base =
    "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-orange-500 text-black hover:bg-orange-400"
      : variant === "secondary"
        ? "bg-zinc-100 text-zinc-900 hover:bg-white"
        : "bg-transparent text-zinc-300 hover:bg-zinc-800";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
