"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { gtmClaimCta } from "@/lib/gtm";

export default function HomeFloatingClaimCta() {
  const t = useTranslations("common");
  const tTrust = useTranslations("home.trustBar");
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("claim");
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-floating-claim", visible);
    return () => document.documentElement.classList.remove("has-floating-claim");
  }, [visible]);

  useEffect(() => {
    const bar = barRef.current;
    if (!visible || !bar) {
      document.documentElement.style.removeProperty("--floating-claim-offset");
      return;
    }

    const apply = () => {
      document.documentElement.style.setProperty("--floating-claim-offset", `${bar.offsetHeight + 56}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--floating-claim-offset");
    };
  }, [visible]);

  if (!visible) return null;

  const benefits = [t("floatingAllAirlines"), t("floatingAllCountries"), tTrust("noWinNoFee")];

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 z-40 px-4 sm:px-6 lg:px-10"
      style={{
        bottom: "calc(var(--cookie-banner-offset, 0px) + 1.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto max-w-[1080px] rounded-[1.75rem] bg-[#2669f3] text-white shadow-[0_18px_46px_rgba(38,105,243,0.42)]">
        <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold leading-snug sm:text-xl">{t("floatingClaim")}</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white sm:text-[15px]">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-1.5">
                  <span aria-hidden="true">✓</span>
                  {benefit.replace(/\.$/, "")}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/#claim"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-base font-bold text-[#2669f3] shadow-sm hover:bg-[#f4f7ff] sm:h-14 sm:px-8"
            {...gtmClaimCta("home_floating")}
          >
            {t("checkCompensation")}
          </Link>
        </div>
      </div>
    </div>
  );
}
