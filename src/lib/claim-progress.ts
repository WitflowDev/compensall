import type { ClaimEntryMode, ClaimFlightData } from "@/lib/claim-types";
import { normalizeFlightData } from "@/lib/claim-types";

/** Query that reopens the in-progress claim from the reminder banner. */
export const CLAIM_PROGRESS_QUERY = "claimReminder";

export const CLAIM_PROGRESS_EVENT = "compensall-claim-progress";
export const CLAIM_PROGRESS_OPEN_EVENT = "compensall-claim-progress-open";

const STORAGE_KEY = "compensall.claim.progress";
const DISMISS_KEY = "compensall.claim.progressDismissed";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type ClaimProgress = {
  v: 1;
  savedAt: number;
  step: 1 | 2 | 3;
  entryMode: ClaimEntryMode | null;
  flight: ClaimFlightData;
};

function notify() {
  window.dispatchEvent(new Event(CLAIM_PROGRESS_EVENT));
}

export function claimProgressStarted(step: 1 | 2 | 3, flight: ClaimFlightData): boolean {
  if (step > 1) return true;
  return flight.status === "Delayed" || flight.status === "Cancelled" || flight.status === "Denied boarding";
}

export function saveClaimProgress(input: {
  step: 1 | 2 | 3;
  entryMode: ClaimEntryMode | null;
  flight: ClaimFlightData;
}) {
  if (!claimProgressStarted(input.step, input.flight)) return;

  const record: ClaimProgress = {
    v: 1,
    savedAt: Date.now(),
    step: input.step,
    entryMode: input.entryMode,
    flight: normalizeFlightData(input.flight),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    notify();
  } catch {
    // Private mode can block storage; the claim still continues in memory.
  }
}

export function peekClaimProgress(): ClaimProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ClaimProgress>;
    if (parsed.v !== 1 || typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (parsed.step !== 1 && parsed.step !== 2 && parsed.step !== 3) return null;
    const flight = normalizeFlightData(parsed.flight);
    if (!claimProgressStarted(parsed.step, flight)) return null;
    const entryMode = parsed.entryMode === "upload" || parsed.entryMode === "manual" ? parsed.entryMode : null;
    return { v: 1, savedAt: parsed.savedAt, step: parsed.step, entryMode, flight };
  } catch {
    return null;
  }
}

export function clearClaimProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(DISMISS_KEY);
    notify();
  } catch {
    // Ignore storage failures.
  }
}

export function dismissClaimProgressBanner() {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
    notify();
  } catch {
    // Ignore storage failures.
  }
}

/** Show the banner only for a claim saved on an earlier visit, and not dismissed this tab. */
export function claimProgressBannerVisible(progress: ClaimProgress | null): boolean {
  if (!progress) return false;
  try {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return false;
  } catch {
    return false;
  }
  return progress.savedAt < performance.timeOrigin;
}

export function stripClaimReminderQuery() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(CLAIM_PROGRESS_QUERY)) return;
  url.searchParams.delete(CLAIM_PROGRESS_QUERY);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", next);
}
