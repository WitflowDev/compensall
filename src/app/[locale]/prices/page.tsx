import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArticleWithToc, type TocItem } from "@/components/ArticleToc";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { headingDomId } from "@/lib/heading-anchor";
import type { AppLocale } from "@/i18n/routing";
import { gtmId } from "@/lib/gtm";
import { buildLocalizedPageMetadata } from "@/lib/i18n-metadata";

type PricesPageProps = {
  params: Promise<{ locale: string }>;
};

const H2 = "scroll-mt-28 font-bold text-[#1f3664] text-lg mb-2 mt-8 first:mt-0";
const H3 = "scroll-mt-28 font-bold text-[#1f3664] text-base mb-2 mt-6";
const P = "text-muted text-sm leading-relaxed mb-4";

export async function generateMetadata({ params }: PricesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedPageMetadata(locale as AppLocale, "/prices", "prices");
}

export default async function PricesPage({ params }: PricesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const brazilian = locale === "pt-BR";
  const t = await getTranslations("prices");

  if (brazilian) {
    return (
      <LegalPageShell title={t("title")} breadcrumbLabel={t("breadcrumb")} summary={t("summary")}>
        <div className="mb-6 p-4 bg-[#f0f5ff] rounded-xl border border-[#d5e0f9]">
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-[#1f3664]">{t("noWinNoFeeIntro")}</strong>{" "}
            {t.rich("noWinNoFeeBody", {
              noWinNoFeeAgreement: (chunks) => (
                <Link
                  href="/documents/no-win-no-fee"
                  className="text-[#2669f3] underline"
                  {...gtmId("prices_nwnf_agreement")}
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
        <ArticleWithToc
          items={[
            { id: headingDomId(t("successFeeTitle"), 0), text: t("successFeeTitle") },
            { id: headingDomId(t("anac.assistanceTitle"), 1), text: t("anac.assistanceTitle") },
            { id: headingDomId(t("anac.deniedTitle"), 2), text: t("anac.deniedTitle") },
          ]}
        >
          <h2 id={headingDomId(t("successFeeTitle"), 0)} className={H2}>
            {t("successFeeTitle")}
          </h2>
          <p className={P}>{t("successFeeDescription")}</p>
          <p className="text-muted text-sm leading-relaxed mb-8">{t("anac.feeNote")}</p>
          <h2 id={headingDomId(t("anac.assistanceTitle"), 1)} className={H2}>
            {t("anac.assistanceTitle")}
          </h2>
          <p className={P}>{t("anac.assistanceBody")}</p>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1 mb-8">
            <li>{t("anac.hour2")}</li>
            <li>{t("anac.hour4")}</li>
          </ul>
          <h2 id={headingDomId(t("anac.deniedTitle"), 2)} className={H2}>
            {t("anac.deniedTitle")}
          </h2>
          <p className={P}>{t("anac.deniedBody")}</p>
          <p className="text-muted text-sm leading-relaxed">{t("anac.choice")}</p>
        </ArticleWithToc>
      </LegalPageShell>
    );
  }

  const handlingBands = t.raw("handling.bands") as string[];
  const otherCompany = t.raw("otherCompany.items") as string[];
  const paymentItems = t.raw("payment.items") as string[];
  const columns = t.raw("examples.columns") as string[];
  const rows = t.raw("examples.rows") as string[][];

  const headings: Array<{ title: string; level: 2 | 3 }> = [
    { title: t("general.title"), level: 2 },
    { title: t("noWin.title"), level: 2 },
    { title: t("received.title"), level: 2 },
    { title: t("service.title"), level: 3 },
    { title: t("litigation.title"), level: 3 },
    { title: t("handling.title"), level: 3 },
    { title: t("examples.title"), level: 3 },
    { title: t("direct.title"), level: 2 },
    { title: t("otherCompany.title"), level: 2 },
    { title: t("payment.title"), level: 2 },
    { title: t("vat.title"), level: 2 },
    { title: t("unclaimed.title"), level: 2 },
    { title: t("records.title"), level: 2 },
  ];
  const toc: TocItem[] = headings.map((heading, index) => ({
    id: headingDomId(heading.title, index),
    text: heading.title,
    level: heading.level,
  }));
  const id = (index: number) => toc[index].id;

  return (
    <LegalPageShell title={t("title")} breadcrumbLabel={t("breadcrumb")} summary={t("summary")}>
      <ArticleWithToc items={toc}>
        <h2 id={id(0)} className={H2}>
          {t("general.title")}
        </h2>
        <p className={P}>{t("general.body")}</p>

        <h2 id={id(1)} className={H2}>
          {t("noWin.title")}
        </h2>
        <p className={P}>{t("noWin.body")}</p>

        <h2 id={id(2)} className={H2}>
          {t("received.title")}
        </h2>

        <h3 id={id(3)} className={H3}>
          {t("service.title")}
        </h3>
        <p className={P}>{t("service.body")}</p>

        <h3 id={id(4)} className={H3}>
          {t("litigation.title")}
        </h3>
        <p className={P}>{t("litigation.body")}</p>

        <h3 id={id(5)} className={H3}>
          {t("handling.title")}
        </h3>
        <p className={P}>{t("handling.body")}</p>
        <ul className="list-disc pl-5 text-sm text-muted space-y-1 mb-4">
          {handlingBands.map((band) => (
            <li key={band}>{band}</li>
          ))}
        </ul>
        <p className={P}>{t("handling.vatNote")}</p>

        <h3 id={id(6)} className={H3}>
          {t("examples.title")}
        </h3>
        <p className={P}>{t("examples.intro")}</p>
        <div className="mb-8 overflow-x-auto rounded-xl border border-[#d5e0f9]">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-[#f0f5ff]">
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-3 py-3 text-left font-semibold text-[#1f3664]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d5e0f9]">
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${row[0]}-${cellIndex}`} className="px-3 py-3 text-muted whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id={id(7)} className={H2}>
          {t("direct.title")}
        </h2>
        <p className={P}>{t("direct.body")}</p>
        <p className={P}>{t("direct.body2")}</p>

        <h2 id={id(8)} className={H2}>
          {t("otherCompany.title")}
        </h2>
        <ul className="list-disc pl-5 text-sm text-muted space-y-2 mb-4">
          {otherCompany.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 id={id(9)} className={H2}>
          {t("payment.title")}
        </h2>
        <ul className="list-disc pl-5 text-sm text-muted space-y-2 mb-4">
          {paymentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 id={id(10)} className={H2}>
          {t("vat.title")}
        </h2>
        <p className={P}>{t("vat.body")}</p>

        <h2 id={id(11)} className={H2}>
          {t("unclaimed.title")}
        </h2>
        <p className={P}>{t("unclaimed.body")}</p>

        <h2 id={id(12)} className={H2}>
          {t("records.title")}
        </h2>
        <p className="text-muted text-sm leading-relaxed">{t("records.body")}</p>
      </ArticleWithToc>
    </LegalPageShell>
  );
}
