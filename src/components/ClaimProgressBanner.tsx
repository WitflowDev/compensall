"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  CLAIM_PROGRESS_EVENT,
  CLAIM_PROGRESS_OPEN_EVENT,
  CLAIM_PROGRESS_QUERY,
  claimProgressBannerVisible,
  dismissClaimProgressBanner,
  peekClaimProgress,
} from "@/lib/claim-progress";

export default function ClaimProgressBanner() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setOpen(claimProgressBannerVisible(peekClaimProgress()));
    refresh();
    window.addEventListener(CLAIM_PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CLAIM_PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!open) return null;

  const dismiss = () => {
    dismissClaimProgressBanner();
    setOpen(false);
  };

  return (
    <div className="border-b border-[#d5e3ff] bg-[#eef4ff]">
      <div className="mx-auto flex max-w-[1550px] flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-4 md:px-8">
        <div className="flex min-w-0 items-start gap-2 sm:flex-1 sm:items-center">
          <span className="shrink-0 rounded-md bg-[#2669f3] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {t("claimReminderBadge")}
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-[#1f3664] sm:text-sm">{t("claimReminderBody")}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/?${CLAIM_PROGRESS_QUERY}=1#claim`}
            onClick={() => {
              dismiss();
              window.dispatchEvent(new Event(CLAIM_PROGRESS_OPEN_EVENT));
            }}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-[#2669f3] bg-white px-3.5 text-sm font-semibold text-[#2669f3] hover:bg-[#2669f3] hover:text-white"
          >
            {t("claimReminderContinue")}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t("claimReminderDismiss")}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[#1f3664]/70 hover:bg-white hover:text-[#1f3664]"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
