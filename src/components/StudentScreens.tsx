import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, CircleAlert, CreditCard, Download, ImagePlus, LockKeyhole, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AppShell, FormField, PageContainer, PageIntro } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { hashPassword, makeTicketId, savePrototypeState, usePrototypeState, compressImage } from "@/lib/prototype";
import garbaBanner from "@/assets/sanjivani-garba-banner.jpg";

const EVENT_DATE = "18 October 2026";
const EVENT_TIME = "6:00 PM onwards";
const EVENT_VENUE = "Sanjivani University Main Ground";
const PRICE = 299;

function eventMetadataProps() { return undefined; }

export function EventHome({ detail = false }: { detail?: boolean }) {
  const state = usePrototypeState();
  const primaryLink = state?.account && state.signedInEmail === state.account.email ? (state.ticket ? "/ticket" : "/profile") : "/register";
  return (
    <AppShell>
      <section className="relative isolate min-h-[540px] overflow-hidden sm:min-h-[600px]">
        <img src={garbaBanner} alt="Students celebrating Garba on a university campus" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/90 via-foreground/55 to-foreground/10" />
        <div className="mx-auto flex min-h-[540px] max-w-7xl items-center px-4 py-14 sm:min-h-[600px] sm:px-8">
          <div className="max-w-2xl text-background">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-background/85"><span className="h-2 w-2 rounded-full bg-primary" /> SANJIVANI UNIVERSITY · 2026</p>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] sm:text-6xl">Sanjivani<br />Garba Night</h1>
            <p className="mt-5 text-lg text-background/85">Dance · Culture · Togetherness</p>
            <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-3 text-sm sm:grid-cols-2">
              <EventMeta label="DATE" value={EVENT_DATE} />
              <EventMeta label="TIME" value={EVENT_TIME} />
              <EventMeta label="VENUE" value="Sanjivani University — Main Ground" />
              <EventMeta label="TICKET" value="₹299 · General Entry" />
            </div>
            <Button size="lg" className="mt-8 h-12 bg-background px-6 text-foreground hover:bg-background/90" asChild>
              <Link to={primaryLink}>Register now <ChevronRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <PageContainer className="grid gap-12 py-12 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">THE EVENING</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Tradition, in rhythm.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Join the Sanjivani community for an evening of Garba, music, and togetherness. A university event, made for our students to celebrate the season together.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-sm border border-border bg-card px-4 py-2 text-sm">Student entry only</span>
            <span className="rounded-sm border border-border bg-card px-4 py-2 text-sm">Carry your university ID</span>
            <span className="rounded-sm border border-border bg-card px-4 py-2 text-sm">Digital ticket at entry</span>
          </div>
          {detail && <p className="mt-8 text-sm text-muted-foreground">A valid digital ticket and institute ID are required at the gate. Entry is subject to a one-time QR check.</p>}
        </div>
        <Card className="rounded-md border-border shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-primary"><Ticket aria-hidden="true" /></span><div><p className="text-sm text-muted-foreground">One ticket</p><p className="font-semibold">General entry</p></div></div>
            <div className="mt-5 border-t border-border pt-5"><p className="text-xs font-semibold text-muted-foreground">TICKET PRICE</p><p className="mt-1 text-3xl font-semibold">₹299</p><p className="mt-1 text-sm text-muted-foreground">All taxes included</p></div>
            <Button className="mt-5 w-full" asChild><Link to={primaryLink}>Get your ticket <ChevronRight aria-hidden="true" /></Link></Button>
          </CardContent>
        </Card>
      </PageContainer>
    </AppShell>
  );
}

function EventMeta({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[11px] font-semibold text-background/65">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ fullName: "", studentId: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [key]: event.target.value }));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.fullName.trim().length < 2 || values.fullName.length > 100) nextErrors.fullName = "Enter your full name.";
    if (!/^[A-Za-z0-9-]{3,32}$/.test(values.studentId.trim())) nextErrors.studentId = "Enter a valid student ID.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length > 255) nextErrors.email = "Enter a valid institute email.";
    if (!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(values.mobile.replace(/\s/g, ""))) nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    if (values.password.length < 8 || values.password.length > 100) nextErrors.password = "Use at least 8 characters.";
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!agree) nextErrors.terms = "Please agree to continue.";
    const current = usePrototypeStateValue();
    if (current?.account?.email.toLowerCase() === values.email.trim().toLowerCase()) nextErrors.email = "An account already exists. Please log in.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    const passwordHash = await hashPassword(values.password);
    savePrototypeState((state) => ({ ...state, account: { fullName: values.fullName.trim(), studentId: values.studentId.trim(), email: values.email.trim().toLowerCase(), mobile: values.mobile.trim(), passwordHash }, signedInEmail: values.email.trim().toLowerCase() }));
    setBusy(false);
    await navigate({ to: "/profile" });
  }
  return (
    <AppShell compact><PageContainer className="max-w-3xl">
      <PageIntro eyebrow="YOUR UNIVERSITY EVENT" title="Create your account" description="A few details to set up your Garba Night entry." />
      <form onSubmit={submit} noValidate className="grid gap-5 rounded-md border border-border bg-card p-5 sm:grid-cols-2 sm:p-8">
        <FormField label="Full name" id="fullName" error={errors.fullName}><Input id="fullName" autoComplete="name" maxLength={100} value={values.fullName} onChange={update("fullName")} placeholder="As shown on your institute ID" /></FormField>
        <FormField label="Student ID" id="studentId" error={errors.studentId}><Input id="studentId" maxLength={32} value={values.studentId} onChange={update("studentId")} placeholder="e.g. SU2026-1042" /></FormField>
        <FormField label="Institute email" id="email" error={errors.email}><Input id="email" type="email" autoComplete="email" maxLength={255} value={values.email} onChange={update("email")} placeholder="name@university.edu" /></FormField>
        <FormField label="Mobile number" id="mobile" error={errors.mobile}><Input id="mobile" type="tel" autoComplete="tel" maxLength={16} value={values.mobile} onChange={update("mobile")} placeholder="10-digit mobile number" /></FormField>
        <FormField label="Password" id="password" error={errors.password}><Input id="password" type="password" autoComplete="new-password" maxLength={100} value={values.password} onChange={update("password")} placeholder="At least 8 characters" /></FormField>
        <FormField label="Confirm password" id="confirmPassword" error={errors.confirmPassword}><Input id="confirmPassword" type="password" autoComplete="new-password" maxLength={100} value={values.confirmPassword} onChange={update("confirmPassword")} placeholder="Enter your password again" /></FormField>
        <div className="sm:col-span-2"><label className="flex cursor-pointer items-center gap-3 text-sm"><Checkbox checked={agree} onCheckedChange={(checked) => setAgree(checked === true)} /> I agree to the Terms &amp; Conditions</label>{errors.terms && <p role="alert" className="mt-2 text-sm text-destructive">{errors.terms}</p>}</div>
        <Button type="submit" className="h-11 sm:col-span-2" disabled={busy}>{busy ? "Creating account…" : "Create account"} {!busy && <ChevronRight aria-hidden="true" />}</Button>
        <p className="text-center text-sm text-muted-foreground sm:col-span-2">Already have an account? <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/login">Login</Link></p>
      </form>
    </PageContainer></AppShell>
  );
}

// Snapshot helper is invoked only from the registration submit event.
function usePrototypeStateValue() {
  return usePrototypeState();
}

export function LoginPage() {
  const state = usePrototypeState();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = state?.account;
    if (!account || !identifier.trim() || !password) { setError(account ? "Enter your login details." : "Create an account first to continue."); return; }
    if (identifier.trim().toLowerCase() !== account.email.toLowerCase() && identifier.trim().toLowerCase() !== account.studentId.toLowerCase()) { setError("We couldn't find an account with those details."); return; }
    setBusy(true);
    const passwordHash = await hashPassword(password);
    setBusy(false);
    if (passwordHash !== account.passwordHash) { setError("The password doesn't match this account."); return; }
    savePrototypeState((current) => ({ ...current, signedInEmail: account.email }));
    await navigate({ to: state?.ticket ? "/ticket" : "/profile" });
  }
  return <AppShell compact><PageContainer className="max-w-xl"><PageIntro eyebrow="WELCOME BACK" title="Log in" description="Continue to your Sanjivani Garba Night ticket." /><form onSubmit={submit} className="grid gap-5 rounded-md border border-border bg-card p-5 sm:p-8"><FormField id="identifier" label="Institute email or student ID"><Input id="identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" maxLength={255} placeholder="name@university.edu or student ID" /></FormField><FormField id="loginPassword" label="Password"><Input id="loginPassword" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" maxLength={100} placeholder="Your password" /></FormField>{error && <p role="alert" className="flex gap-2 text-sm text-destructive"><CircleAlert className="h-4 w-4 shrink-0" />{error}</p>}<Button className="h-11" disabled={busy}>{busy ? "Signing in…" : "Login"}<ChevronRight aria-hidden="true" /></Button><p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link></p></form></PageContainer></AppShell>;
}

export function ProfilePage() {
  const state = usePrototypeState();
  const navigate = useNavigate();
  const account = state?.account;
  const [photo, setPhoto] = useState(account?.photo ?? "");
  const [idCard, setIdCard] = useState(account?.idCard ?? "");
  const [error, setError] = useState("");
  const [loadingImage, setLoadingImage] = useState("");
  async function chooseImage(file: File | undefined, kind: "photo" | "idCard") {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setError("Choose an image file under 8 MB."); return; }
    setLoadingImage(kind);
    try {
      const compressed = await compressImage(file);
      if (kind === "photo") setPhoto(compressed); else setIdCard(compressed);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "This image could not be opened."); }
    setLoadingImage("");
  }
  async function continueToEvent() {
    if (!account) return;
    if (!photo || !idCard) { setError("Add both images before continuing."); return; }
    savePrototypeState((current) => ({ ...current, account: current.account ? { ...current.account, photo, idCard } : current.account }));
    await navigate({ to: "/event" });
  }
  if (!account || state?.signedInEmail !== account.email) return <NeedLogin next="profile" />;
  return <AppShell compact><PageContainer className="max-w-3xl"><PageIntro eyebrow="STEP 1 OF 3 · PROFILE" title="Complete your entry profile" description="Your details and photographs help the gate team verify your entry." />
    <div className="grid gap-6">
      <Card className="rounded-md border-border shadow-none"><CardContent className="p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary"><UserRound aria-hidden="true" /></span><div><h2 className="font-semibold">Personal details</h2><p className="text-sm text-muted-foreground">As registered with the university</p></div></div><dl className="grid gap-4 sm:grid-cols-2"><ProfileValue label="Full name" value={account.fullName} /><ProfileValue label="Student ID" value={account.studentId} /><ProfileValue label="Email" value={account.email} /><ProfileValue label="Mobile number" value={account.mobile} /></dl></CardContent></Card>
      <Card className="rounded-md border-border shadow-none"><CardContent className="p-5 sm:p-7"><h2 className="font-semibold">Verification documents</h2><p className="mt-1 text-sm text-muted-foreground">Image selection stays in this browser prototype.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><PhotoPicker id="entryPhoto" label="Latest Photo for Entry Verification" value={photo} busy={loadingImage === "photo"} onChange={(file) => void chooseImage(file, "photo")} /><PhotoPicker id="studentIdCard" label="Institute ID Card" value={idCard} busy={loadingImage === "idCard"} onChange={(file) => void chooseImage(file, "idCard")} /></div></CardContent></Card>
      {error && <p role="alert" className="flex items-center gap-2 text-sm text-destructive"><CircleAlert className="h-4 w-4" />{error}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button variant="outline" asChild><Link to="/">Back to event</Link></Button><Button onClick={() => void continueToEvent()} className="h-11">Continue <ChevronRight aria-hidden="true" /></Button></div>
    </div>
  </PageContainer></AppShell>;
}

function ProfileValue({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>; }

function PhotoPicker({ id, label, value, busy, onChange }: { id: string; label: string; value: string; busy: boolean; onChange: (file?: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return <div className="grid gap-2"><label htmlFor={id} className="text-sm font-medium">{label}</label><button type="button" onClick={() => inputRef.current?.click()} className="grid min-h-40 place-items-center overflow-hidden rounded-md border border-dashed border-input bg-muted/30 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Select ${label}`}>
    {value ? <img src={value} alt={label} className="h-40 w-full object-cover" /> : <span className="flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground"><ImagePlus aria-hidden="true" className="h-6 w-6" />{busy ? "Preparing image…" : "Choose an image"}</span>}
  </button><input ref={inputRef} id={id} type="file" accept="image/*" className="sr-only" onChange={(event) => { onChange(event.target.files?.[0]); event.target.value = ""; }} /><p className="text-xs text-muted-foreground">Image file · up to 8 MB</p></div>;
}

export function EventRegistrationPage() {
  const state = usePrototypeState();
  const navigate = useNavigate();
  const account = state?.account;
  if (!account || state?.signedInEmail !== account.email) return <NeedLogin next="event" />;
  if (!account.photo || !account.idCard) return <NeedProfile />;
  return <AppShell compact><PageContainer className="max-w-4xl"><PageIntro eyebrow="STEP 2 OF 3 · EVENT" title="Your Garba Night ticket" description="Review your ticket details before secure payment." /><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-md border border-border bg-card p-5 sm:p-7"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Ticket aria-hidden="true" /></span><div><p className="text-xs font-semibold text-primary">SANJIVANI UNIVERSITY</p><h2 className="mt-1 text-xl font-semibold">Sanjivani Garba Night</h2><p className="mt-2 text-sm text-muted-foreground">General Entry</p></div></div><dl className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2"><ProfileValue label="Date" value={EVENT_DATE} /><ProfileValue label="Time" value={EVENT_TIME} /><div className="sm:col-span-2"><ProfileValue label="Venue" value={EVENT_VENUE} /></div></dl><div className="mt-6 rounded-sm border border-border bg-muted/35 p-4"><p className="text-sm font-semibold">Entry requirements</p><ul className="mt-2 space-y-2 text-sm text-muted-foreground"><li className="flex gap-2"><Check className="h-4 w-4 text-primary" />Show your digital ticket at the gate.</li><li className="flex gap-2"><Check className="h-4 w-4 text-primary" />Carry your institute ID for verification.</li></ul></div></div><Card className="h-fit rounded-md border-border shadow-none"><CardContent className="p-6"><h3 className="font-semibold">Order summary</h3><div className="mt-5 flex justify-between text-sm"><span className="text-muted-foreground">General Entry</span><span>₹299</span></div><div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold"><span>Total</span><span>₹299</span></div><Button className="mt-5 w-full" onClick={() => void navigate({ to: "/payment" })}>Proceed to payment <ChevronRight aria-hidden="true" /></Button></CardContent></Card></div></PageContainer></AppShell>;
}

export function PaymentPage() {
  const state = usePrototypeState();
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  if (!state?.account || state.signedInEmail !== state.account.email) return <NeedLogin next="payment" />;
  if (!state.account.photo || !state.account.idCard) return <NeedProfile />;
  if (state.ticket) return <AlreadyTicket />;
  async function pay() {
    if (processing) return;
    setError(""); setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1100));
    try {
      const token = makeTicketId();
      savePrototypeState((current) => ({ ...current, extraPaid: current.extraPaid + 1, ticket: { id: token, token, status: "ACTIVE", paymentMethod: method, purchasedAt: new Date().toISOString() } }));
      await navigate({ to: "/success" });
    } catch {
      setError("Payment could not be completed. Please try again."); setProcessing(false);
    }
  }
  return <AppShell compact><PageContainer className="max-w-4xl"><PageIntro eyebrow="STEP 3 OF 3 · PAYMENT" title="Complete your booking" description="This is a secure-looking simulation. No money will be charged." /><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><div><div className="rounded-md border border-border bg-card p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-primary"><LockKeyhole aria-hidden="true" /></span><div><h2 className="font-semibold">Choose payment method</h2><p className="text-sm text-muted-foreground">Select a method for the demo.</p></div></div><div className="mt-5 grid gap-3">{[{ name: "UPI", icon: "UPI", info: "Google Pay · PhonePe · more" }, { name: "Card", icon: "CARD", info: "Debit or credit card" }, { name: "Net banking", icon: "BANK", info: "Online bank transfer" }].map((item) => <label key={item.name} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors ${method === item.name ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}><input type="radio" name="paymentMethod" value={item.name} checked={method === item.name} onChange={() => setMethod(item.name)} className="accent-primary focus-visible:ring-2 focus-visible:ring-ring" /><span className="grid h-9 w-11 shrink-0 place-items-center rounded-sm bg-muted text-xs font-bold text-foreground">{item.icon}</span><span><span className="block text-sm font-semibold">{item.name === "Card" ? "Debit / Credit Card" : item.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.info}</span></span></label>)}</div><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Demo only · No payment information is collected</p></div></div><Card className="h-fit rounded-md border-border shadow-none"><CardContent className="p-6"><p className="text-xs font-semibold text-primary">ORDER SUMMARY</p><h2 className="mt-2 font-semibold">Sanjivani Garba Night</h2><div className="mt-5 flex justify-between text-sm"><span className="text-muted-foreground">Ticket</span><span>₹299</span></div><div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold"><span>Total</span><span>₹299</span></div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<Button className="mt-5 w-full" disabled={processing} onClick={() => void pay()}>{processing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Processing…</> : <>Pay ₹299 <ChevronRight aria-hidden="true" /></>}</Button></CardContent></Card></div></PageContainer></AppShell>;
}

export function PaymentSuccessPage() {
  const state = usePrototypeState();
  if (!state?.ticket || !state.account) return <NoTicket />;
  return <AppShell compact><PageContainer className="max-w-xl"><div className="rounded-md border border-border bg-card px-6 py-12 text-center sm:px-10"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground"><Check aria-hidden="true" className="h-7 w-7" /></span><p className="mt-6 text-sm font-semibold text-primary">PAYMENT COMPLETE</p><h1 className="mt-2 text-3xl font-semibold">Payment successful</h1><p className="mt-3 text-muted-foreground">Your ticket has been generated successfully.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><Button asChild><Link to="/ticket">View ticket <ChevronRight aria-hidden="true" /></Link></Button><Button variant="outline" onClick={() => window.print()}><Download aria-hidden="true" /> Download PDF</Button></div><p className="mt-4 text-xs text-muted-foreground">A print-ready ticket view will open. Choose “Save as PDF” to download.</p></div></PageContainer></AppShell>;
}

export function TicketPage() {
  const state = usePrototypeState();
  const account = state?.account;
  const ticket = state?.ticket;
  if (!account || !ticket) return <NoTicket />;
  const status = ticket.status === "ACTIVE" ? "ACTIVE" : "CHECKED IN / USED";
  return <AppShell compact><PageContainer className="max-w-3xl print:max-w-none print:p-0"><PageIntro eyebrow="MY TICKET" title="Your Garba Night pass" description="Keep your QR code ready to scan at the university gate." /><div className="overflow-hidden rounded-md border border-border bg-card shadow-sm print:shadow-none"><div className="grid grid-cols-1 bg-primary text-primary-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-7 sm:py-6"><div className="p-5 sm:p-0"><p className="text-xs font-semibold text-primary-foreground/80">SANJIVANI UNIVERSITY</p><h2 className="mt-2 text-2xl font-bold">SANJIVANI GARBA NIGHT</h2><p className="mt-1 text-sm text-primary-foreground/85">Dance · Culture · Togetherness</p></div><div className="border-t border-primary-foreground/20 p-5 sm:border-0 sm:p-0 sm:text-right"><p className="text-xs text-primary-foreground/75">GENERAL ENTRY</p><p className="mt-1 text-2xl font-semibold">₹299</p></div></div><div className="grid gap-7 p-5 sm:grid-cols-[minmax(0,1fr)_228px] sm:gap-8 sm:p-7"><div className="min-w-0"><div className="flex items-center gap-4"><StudentPortrait photo={account.photo} name={account.fullName} /><div className="min-w-0"><h3 className="break-words text-lg font-semibold">{account.fullName}</h3><p className="mt-1 text-sm text-muted-foreground">Student ID: {account.studentId}</p></div></div><dl className="mt-7 grid gap-4 sm:grid-cols-2"><ProfileValue label="DATE" value={EVENT_DATE} /><ProfileValue label="TIME" value={EVENT_TIME} /><div className="sm:col-span-2"><ProfileValue label="VENUE" value={EVENT_VENUE} /></div></dl><div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5"><div><p className="text-xs text-muted-foreground">TICKET ID</p><p className="mt-1 break-all font-mono text-sm font-semibold">{ticket.id}</p></div><div><p className="text-xs text-muted-foreground">STATUS</p><span className={`mt-1 inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold ${ticket.status === "ACTIVE" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{status}</span></div></div>{ticket.checkedInAt && <p className="mt-4 text-sm text-muted-foreground">Checked in at {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ticket.checkedInAt))} · {ticket.gate}</p>}</div><div className="mx-auto flex w-full max-w-[250px] flex-col items-center sm:max-w-none"><div className="rounded-md border border-border bg-background p-3"><QRCodeSVG value={ticket.token} size={196} level="M" includeMargin aria-label={`Ticket QR code for ${ticket.id}`} /></div><p className="mt-3 text-center text-sm font-semibold">Scan for entry</p><p className="mt-1 break-all text-center font-mono text-xs text-muted-foreground">{ticket.token}</p></div></div><div className="mx-5 border-t border-dashed border-border sm:mx-7" /><div className="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-7"><StudentPortrait photo={account.idCard} name="Institute ID Card" card /><div><p className="text-xs font-semibold text-muted-foreground">VISUAL VERIFICATION</p><h3 className="mt-1 font-semibold">Institute ID Card</h3><p className="mt-1 text-sm text-muted-foreground">Show your institute ID with this digital ticket at entry.</p></div></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between print:hidden"><Button variant="outline" onClick={() => window.print()}><Download aria-hidden="true" /> Download / print ticket</Button><Button variant="outline" asChild><Link to="/">Event details</Link></Button></div><p className="mt-4 text-center text-xs text-muted-foreground print:hidden">Your QR code contains a ticket token only. Never share your password with anyone.</p></PageContainer></AppShell>;
}

function StudentPortrait({ photo, name, card = false }: { photo?: string; name: string; card?: boolean }) { return photo ? <img src={photo} alt={name} loading="lazy" className={card ? "h-16 w-24 rounded-sm border border-border object-cover" : "h-20 w-20 shrink-0 rounded-md border border-border object-cover"} /> : <span aria-label={name} className={`grid shrink-0 place-items-center rounded-md bg-secondary text-primary ${card ? "h-16 w-24" : "h-20 w-20"}`}><UserRound aria-hidden="true" /></span>; }

function NeedLogin({ next }: { next: string }) { return <AppShell compact><PageContainer className="max-w-xl"><PageIntro eyebrow="ACCOUNT NEEDED" title="Log in to continue" description="Sign in with the account you created for this event." /><div className="flex flex-wrap gap-3"><Button asChild><Link to="/login">Login <ChevronRight aria-hidden="true" /></Link></Button><Button variant="outline" asChild><Link to="/register">Create account</Link></Button></div><p className="sr-only">Continue to {next}</p></PageContainer></AppShell>; }
function NeedProfile() { return <AppShell compact><PageContainer className="max-w-xl"><PageIntro eyebrow="PROFILE REQUIRED" title="Add your verification photos" description="Your latest photo and institute ID card are required before booking." /><Button asChild><Link to="/profile">Complete profile <ChevronRight aria-hidden="true" /></Link></Button></PageContainer></AppShell>; }
function AlreadyTicket() { return <AppShell compact><PageContainer className="max-w-xl"><PageIntro eyebrow="BOOKING COMPLETE" title="Your ticket is ready" description="Your event ticket has already been generated." /><Button asChild><Link to="/ticket">View ticket <ChevronRight aria-hidden="true" /></Link></Button></PageContainer></AppShell>; }
function NoTicket() { return <AppShell compact><PageContainer className="max-w-xl"><PageIntro eyebrow="NO TICKET YET" title="Your Garba Night ticket is waiting" description="Register and finish the demo payment to generate your ticket." /><Button asChild><Link to="/event">Continue booking <ChevronRight aria-hidden="true" /></Link></Button></PageContainer></AppShell>; }

export const EVENT_DATE_TEXT = EVENT_DATE;
export const EVENT_TIME_TEXT = EVENT_TIME;
export const EVENT_VENUE_TEXT = EVENT_VENUE;
export const EVENT_PRICE = PRICE;
void useMemo;
void eventMetadataProps;
void CreditCard;
void ImagePlus;
void LockKeyhole;