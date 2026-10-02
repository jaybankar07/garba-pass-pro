import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TicketCheck } from "lucide-react";
import { usePrototypeState } from "@/lib/prototype";
import { Button } from "@/components/ui/button";

export function AppShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const state = usePrototypeState();
  const signedIn = Boolean(state?.account && state.signedInEmail === state.account.email);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/95">
        <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3 text-inherit no-underline" aria-label="Sanjivani University home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">SU</span>
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold">Sanjivani University</span>
              <span className="block truncate text-xs text-muted-foreground">Student events</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center justify-end gap-1 sm:gap-2">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hidden px-2 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">Home</Link>
            <Link to="/event" activeProps={{ className: "text-foreground" }} className="hidden px-2 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">Event</Link>
            {signedIn && state?.ticket ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/ticket"><TicketCheck aria-hidden="true" /> My ticket</Link>
              </Button>
            ) : signedIn ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">My profile</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
            {!compact && (
              <Button size="sm" asChild>
                <Link to={signedIn ? (state?.ticket ? "/ticket" : "/profile") : "/register"}>
                  {signedIn ? (state?.ticket ? "My ticket" : "Complete profile") : "Register"}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Sanjivani University · Sanjivani Garba Night 2026</span>
          <div className="flex items-center gap-4">
            <Link to="/gate" className="hover:text-foreground">Gate entry</Link>
            <Link to="/admin" className="hover:text-foreground">Event operations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12 ${className}`}>{children}</div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

export function FormField({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
