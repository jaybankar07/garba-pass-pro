import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, CameraOff, Check, CircleAlert, RefreshCw, ShieldCheck, Ticket, Users, X } from "lucide-react";
import { AppShell, PageContainer, PageIntro } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatEventDateTime, getTicketStats, savePrototypeState, usePrototypeState } from "@/lib/prototype";

type ScanResult = "allowed" | "used" | "invalid" | null;

export function GateScanner() {
  const state = usePrototypeState();
  const [token, setToken] = useState("");
  const [result, setResult] = useState<ScanResult>(null);
  const [error, setError] = useState("");
  const [gate, setGate] = useState("Gate 01");
  const [cameraState, setCameraState] = useState<"idle" | "starting" | "active" | "error">("idle");
  const [cameraMessage, setCameraMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraState("idle");
  }
  async function startCamera() {
    setCameraMessage(""); setError(""); setResult(null);
    if (!navigator.mediaDevices?.getUserMedia) { setCameraState("error"); setCameraMessage("Camera scanning requires a supported browser and secure connection. Use manual entry instead."); return; }
    setCameraState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraState("active");
    } catch { setCameraState("error"); setCameraMessage("Camera access is unavailable. Check browser permission or enter the ticket token manually."); }
  }
  useEffect(() => {
    if (cameraState !== "active") return;
    let frame = 0;
    let mounted = true;
    const decode = () => {
      if (!mounted) return;
      const video = videoRef.current;
      if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d", { willReadFrequently: true });
        if (canvas && context && video.videoWidth > 0) {
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const image = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
          if (code?.data) { setToken(code.data); setCameraMessage("Ticket QR detected."); setCameraState("idle"); streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; return; }
        }
      }
      frame = window.requestAnimationFrame(decode);
    };
    frame = window.requestAnimationFrame(decode);
    return () => { mounted = false; window.cancelAnimationFrame(frame); };
  }, [cameraState]);
  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  function validate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = token.trim().slice(0, 80);
    setError(""); setCameraMessage("");
    if (!clean) { setError("Enter or scan a ticket token."); setResult(null); return; }
    const ticket = state?.ticket;
    if (!ticket || clean !== ticket.token || !/^[A-Z0-9-]{8,80}$/.test(clean)) { setResult("invalid"); return; }
    if (ticket.status === "CHECKED IN") { setResult("used"); return; }
    const now = new Date().toISOString();
    const checkIn = { fullName: state.account?.fullName ?? "Student", studentId: state.account?.studentId ?? "—", ticketId: ticket.id, gate, time: now };
    savePrototypeState((current) => ({ ...current, extraCheckedIn: current.extraCheckedIn + 1, ticket: current.ticket ? { ...current.ticket, status: "CHECKED IN", checkedInAt: now, gate } : undefined, recentCheckIns: [checkIn, ...current.recentCheckIns].slice(0, 20) }));
    setResult("allowed");
  }
  function resetScanner() { setToken(""); setResult(null); setError(""); setCameraMessage(""); }

  return <div className="min-h-screen bg-foreground text-background"><header className="border-b border-background/15"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-8"><Link to="/" className="flex items-center gap-3 text-background"><span className="grid h-9 w-9 place-items-center rounded-sm border border-background/20"><span className="text-xs font-bold">SU</span></span><span><span className="block text-sm font-semibold">Sanjivani University</span><span className="block text-xs text-background/60">Entry operations</span></span></Link><span className="flex items-center gap-2 rounded-sm border border-background/20 px-3 py-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-400" /> ONLINE</span></div></header>
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10"><div className="mb-7 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-background/55">SANJIVANI GARBA NIGHT</p><h1 className="mt-1 text-3xl font-semibold">Gate scanner</h1></div><label className="grid gap-1.5 text-xs font-medium">Gate<select value={gate} onChange={(event) => setGate(event.target.value)} className="h-10 rounded-sm border border-background/20 bg-background/10 px-3 text-sm text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option className="text-foreground">Gate 01</option><option className="text-foreground">Gate 02</option><option className="text-foreground">Gate 03</option><option className="text-foreground">Gate 04</option></select></label></div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]"><section className="rounded-md border border-background/15 bg-background/5 p-4 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Scan student ticket</h2><p className="mt-1 text-sm text-background/60">Position the QR code inside the frame.</p></div><Ticket aria-hidden="true" className="h-5 w-5 text-background/60" /></div><div className="relative mt-5 grid aspect-[4/3] min-h-56 place-items-center overflow-hidden rounded-sm border border-background/20 bg-background/5 sm:aspect-[16/8]"><video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${cameraState === "active" ? "block" : "hidden"}`} aria-label="Live ticket scanner camera" /><canvas ref={canvasRef} className="hidden" /><div aria-hidden="true" className="pointer-events-none absolute inset-[15%] border-2 border-background/70"><i className="absolute -left-0.5 -top-0.5 h-5 w-5 border-l-4 border-t-4 border-primary" /><i className="absolute -right-0.5 -top-0.5 h-5 w-5 border-r-4 border-t-4 border-primary" /><i className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-primary" /><i className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-primary" /></div><div className="relative z-10 flex flex-col items-center gap-2 text-center"><Camera className="h-8 w-8 text-background/60" /><span className="text-sm font-medium">{cameraState === "active" ? "Looking for a ticket…" : cameraState === "starting" ? "Starting camera…" : "Camera ready"}</span></div></div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button onClick={() => void startCamera()} disabled={cameraState === "starting" || cameraState === "active"} className="bg-background text-foreground hover:bg-background/90"><Camera aria-hidden="true" />{cameraState === "active" ? "Scanning…" : cameraState === "starting" ? "Starting…" : "Start camera"}</Button>{cameraState === "active" && <Button variant="outline" onClick={stopCamera} className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"><CameraOff aria-hidden="true" />Stop camera</Button>}<Button variant="outline" onClick={resetScanner} className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"><RefreshCw aria-hidden="true" />Reset</Button></div>{cameraMessage && <p className="mt-3 text-sm text-background/70">{cameraMessage}</p>}
        <form onSubmit={validate} className="mt-7 border-t border-background/15 pt-6"><label htmlFor="ticketToken" className="text-sm font-medium">Manual entry</label><div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2"><Input id="ticketToken" autoComplete="off" spellCheck={false} maxLength={80} value={token} onChange={(event) => { setToken(event.target.value); setResult(null); }} placeholder="Enter ticket token" className="border-background/20 bg-background/10 font-mono text-background placeholder:text-background/45" /><Button type="submit" className="bg-background text-foreground hover:bg-background/90">Verify</Button></div>{error && <p role="alert" className="mt-2 text-sm text-amber-200">{error}</p>}</form>
      </section><section aria-live="polite">{result ? <CheckInResult result={result} state={state} gate={gate} onReset={resetScanner} /> : <div className="rounded-md border border-background/15 bg-background/5 p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-sm bg-background/10"><ShieldCheck aria-hidden="true" /></span><div><h2 className="font-semibold">Ready for entry</h2><p className="text-xs text-background/60">Awaiting ticket scan</p></div></div><p className="mt-5 text-sm leading-6 text-background/65">Scan a student QR ticket or enter its token manually. Each active ticket is accepted once.</p><div className="mt-5 border-t border-background/15 pt-4"><div className="flex justify-between text-sm"><span className="text-background/60">Selected gate</span><span className="font-medium">{gate}</span></div><Link to="/admin" className="mt-4 inline-flex items-center gap-2 text-sm text-background/75 underline-offset-4 hover:underline">Open event operations <ArrowLeft className="h-4 w-4 rotate-180" /></Link></div></div>}</section></div>
    </main></div>;
}

function CheckInResult({ result, state, gate, onReset }: { result: Exclude<ScanResult, null>; state: ReturnType<typeof usePrototypeState>; gate: string; onReset: () => void }) {
  const ticket = state?.ticket;
  const account = state?.account;
  const previous = ticket?.checkedInAt;
  const allowed = result === "allowed";
  const used = result === "used";
  return <div className={`rounded-md border p-5 ${allowed ? "border-emerald-400/40 bg-emerald-950/35" : "border-destructive/40 bg-destructive/10"}`}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-sm bg-background/10">{allowed ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}</span><div><p className="text-xs font-bold tracking-wide">{allowed ? "ENTRY ALLOWED" : "ENTRY DENIED"}</p><h2 className="mt-1 text-xl font-semibold">{allowed ? "Check-in successful" : used ? "Ticket already used" : "Invalid ticket"}</h2></div></div>{allowed && ticket && account ? <><div className="mt-5 flex items-center gap-3">{account.photo ? <img src={account.photo} alt={account.fullName} className="h-14 w-14 rounded-sm object-cover" /> : <span className="h-14 w-14 rounded-sm bg-background/15" />}<div><p className="font-semibold">{account.fullName}</p><p className="text-sm text-background/65">{account.studentId}</p></div></div><dl className="mt-5 space-y-3 border-t border-background/15 pt-4 text-sm"><MiniValue label="Ticket ID" value={ticket.id} /><MiniValue label="Event" value="Sanjivani Garba Night" /><MiniValue label="Gate" value={gate} /><MiniValue label="Checked in" value={ticket.checkedInAt ? formatEventDateTime(ticket.checkedInAt) : "Just now"} /></dl></> : used && ticket ? <div className="mt-5 border-t border-background/15 pt-4"><p className="text-sm font-semibold">TICKET ALREADY USED</p><dl className="mt-4 space-y-3 text-sm"><MiniValue label="Previous check-in" value={previous ? formatEventDateTime(previous) : "Previously checked in"} /><MiniValue label="Gate" value={ticket.gate ?? "Gate 01"} /><MiniValue label="Ticket ID" value={ticket.id} /></dl></div> : <p className="mt-4 text-sm text-background/70">No matching active ticket was found for this token.</p>}<Button variant="outline" onClick={onReset} className="mt-5 w-full border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">Scan next ticket</Button></div>;
}

function MiniValue({ label, value }: { label: string; value: string }) { return <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2"><dt className="text-background/60">{label}</dt><dd className="min-w-0 break-words text-right font-medium">{value}</dd></div>; }

const demoCheckIns = [
  { fullName: "Aarav Mehta", studentId: "SU2026-0841", ticketId: "GARB26-A3F29C18", gate: "Gate 02", time: "2026-10-18T18:26:00+05:30" },
  { fullName: "Ananya Patil", studentId: "SU2026-1120", ticketId: "GARB26-91DC203B", gate: "Gate 01", time: "2026-10-18T18:23:00+05:30" },
  { fullName: "Rohan Deshmukh", studentId: "SU2026-0376", ticketId: "GARB26-06AF8751", gate: "Gate 03", time: "2026-10-18T18:19:00+05:30" },
];

export function AdminDashboard() {
  const state = usePrototypeState();
  const stats = getTicketStats(state ?? { recentCheckIns: [], extraPaid: 0, extraCheckedIn: 0 });
  const rows = [...(state?.recentCheckIns ?? []), ...demoCheckIns].slice(0, 12);
  return <AppShell><PageContainer><div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-end sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold text-primary">SANJIVANI UNIVERSITY</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Event operations</h1><p className="mt-2 text-sm text-muted-foreground">Sanjivani Garba Night · 18 October 2026</p></div><Button variant="outline" size="sm" asChild><Link to="/gate"><Camera aria-hidden="true" /> Gate scanner</Link></Button></div>
    <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ticket statistics">{[{ label: "Total tickets", value: stats.capacity.toLocaleString("en-IN"), icon: Ticket }, { label: "Paid", value: stats.paid.toLocaleString("en-IN"), icon: Check }, { label: "Checked in", value: stats.checkedIn.toLocaleString("en-IN"), icon: Users }, { label: "Remaining", value: stats.remaining.toLocaleString("en-IN"), icon: CircleAlert }].map((item) => <StatCard key={item.label} label={item.label} value={item.value} icon={<item.icon aria-hidden="true" className="h-4 w-4" />} />)}</section>
    <section className="mt-10"><div className="flex items-end justify-between gap-3"><div><h2 className="text-xl font-semibold">Gate status</h2><p className="mt-1 text-sm text-muted-foreground">All event entry points are ready.</p></div><span className="text-xs text-muted-foreground">4 gates</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Gate 01", "Gate 02", "Gate 03", "Gate 04"].map((gate) => <div key={gate} className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3"><span className="text-sm font-medium">{gate}</span><span className="flex items-center gap-2 text-xs text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-600" />Online</span></div>)}</div></section>
    <section className="mt-10"><div className="flex items-end justify-between"><div><h2 className="text-xl font-semibold">Recent check-ins</h2><p className="mt-1 text-sm text-muted-foreground">Newest entry scans appear first.</p></div><Button variant="ghost" size="sm" asChild><Link to="/gate">Open gate <ArrowLeft className="rotate-180" aria-hidden="true" /></Link></Button></div><div className="mt-4 overflow-hidden rounded-md border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead className="bg-muted/60 text-xs text-muted-foreground"><tr>{["Student", "Student ID", "Ticket ID", "Gate", "Time", "Status"].map((heading) => <th key={heading} scope="col" className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.ticketId}-${index}`} className="border-t border-border"><td className="px-4 py-3 font-medium">{row.fullName}</td><td className="px-4 py-3 text-muted-foreground">{row.studentId}</td><td className="px-4 py-3 font-mono text-xs">{row.ticketId}</td><td className="px-4 py-3">{row.gate}</td><td className="px-4 py-3 text-muted-foreground">{formatEventDateTime(row.time)}</td><td className="px-4 py-3"><span className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">Checked in</span></td></tr>)}</tbody></table></div></div></section><p className="mt-5 text-xs text-muted-foreground">Prototype statistics include sample event activity. Your scans update this view in the same browser.</p>
  </PageContainer></AppShell>;
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <Card className="rounded-md border-border shadow-none"><CardContent className="flex items-start justify-between p-5"><div><p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p></div><span className="grid h-9 w-9 place-items-center rounded-sm bg-secondary text-primary">{icon}</span></CardContent></Card>; }
