import { useSyncExternalStore } from "react";

export type TicketStatus = "ACTIVE" | "CHECKED IN";

export interface PrototypeAccount {
  fullName: string;
  studentId: string;
  email: string;
  mobile: string;
  passwordHash: string;
  photo?: string;
  idCard?: string;
}

export interface CheckInRecord {
  fullName: string;
  studentId: string;
  ticketId: string;
  gate: string;
  time: string;
}

export interface PrototypeTicket {
  id: string;
  token: string;
  status: TicketStatus;
  paymentMethod: string;
  purchasedAt: string;
  checkedInAt?: string;
  gate?: string;
}

export interface PrototypeState {
  account?: PrototypeAccount;
  signedInEmail?: string;
  ticket?: PrototypeTicket;
  recentCheckIns: CheckInRecord[];
  extraPaid: number;
  extraCheckedIn: number;
}

const STORAGE_KEY = "sanjivani-garba-prototype-v1";
const DEMO_PAID = 9842;
const DEMO_CHECKED_IN = 7421;
let snapshot: PrototypeState | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function readState(): PrototypeState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<PrototypeState>;
    return {
      ...emptyState(),
      ...parsed,
      recentCheckIns: Array.isArray(parsed.recentCheckIns) ? parsed.recentCheckIns : [],
      extraPaid: typeof parsed.extraPaid === "number" ? parsed.extraPaid : 0,
      extraCheckedIn: typeof parsed.extraCheckedIn === "number" ? parsed.extraCheckedIn : 0,
    };
  } catch {
    return emptyState();
  }
}

function emptyState(): PrototypeState {
  return { recentCheckIns: [], extraPaid: 0, extraCheckedIn: 0 };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (snapshot === null) {
    snapshot = readState();
    queueMicrotask(notify);
  }
  if (typeof window !== "undefined") {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        snapshot = readState();
        notify();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => listeners.delete(listener);
}

export function usePrototypeState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function savePrototypeState(
  update: (current: PrototypeState) => PrototypeState,
) {
  const current = snapshot ?? readState();
  snapshot = update(current);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Keep the current session usable if a browser blocks or fills local storage.
    }
  }
  notify();
}

export function getTicketStats(state: PrototypeState) {
  const paid = DEMO_PAID + state.extraPaid;
  const checkedIn = DEMO_CHECKED_IN + state.extraCheckedIn;
  return { capacity: 10000, paid, checkedIn, remaining: 10000 - paid };
}

export function formatEventDateTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("This image could not be opened."));
    reader.onload = () => {
      const source = new Image();
      source.onerror = () => reject(new Error("This image could not be opened."));
      source.onload = () => {
        const scale = Math.min(1, 1000 / Math.max(source.naturalWidth, source.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("This image could not be prepared."));
          return;
        }
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      source.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function makeTicketId() {
  const values = new Uint8Array(4);
  crypto.getRandomValues(values);
  return `GARB26-${Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
