import { jsPDF } from "jspdf";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import {
  NOTO_RUPEE_BOLD_BASE64,
  NOTO_RUPEE_REGULAR_BASE64,
} from "@/lib/pdf/noto-rupee-font-data";
import {
  formatForPDF,
  HIGH_RETURN_THRESHOLD_PCT,
  HIGH_RETURN_WARNING,
  isInvestmentReturnInput,
  normalizePdfMoneyText,
  parsePercentFromLabelValue,
} from "@/lib/pdf/format";

export type PdfInputRow = { label: string; value: string };
export type PdfResultRow = { label: string; value: string };
export type PdfTableColumn = { header: string; key: string };
export type PdfTableRow = Record<string, string | number>;

export type PremiumPdfOptions = {
  title: string;
  /** Short line under the title */
  tagline?: string;
  subtitle?: string;
  inputs: PdfInputRow[];
  results: PdfResultRow[];
  hero?: { label: string; value: string; hint?: string };
  chartSlices?: { label: string; value: number; color?: string }[];
  /** Outstanding balance (or corpus) over time — numeric, in order */
  balanceSeries?: number[];
  balanceChartTitle?: string;
  /**
   * Investment / loan horizon in years for the balance series.
   * Required for correct X-axis labels when the series is yearly (SIP) vs monthly (EMI).
   */
  balanceSeriesYears?: number;
  journey?: string[];
  table?: {
    columns: PdfTableColumn[];
    rows: PdfTableRow[];
    maxRows?: number;
    title?: string;
    /** Collapse monthly rows into one year-end summary row per year */
    groupByYear?: boolean;
    monthKey?: string;
  };
  fileName?: string;
  /** Explicit expected return % — triggers high-return warning when > 15 */
  expectedReturnPct?: number;
};

/** Brand tokens aligned with `theme` in design-system.ts / globals.css */
const COLORS = {
  navy: [11, 31, 51] as [number, number, number], // #0B1F33
  navyMid: [38, 55, 70] as [number, number, number], // #263746
  gold: [15, 118, 110] as [number, number, number], // accent teal used for header accent bar
  turquoise: [15, 118, 110] as [number, number, number], // #0F766E
  ink: [23, 32, 42] as [number, number, number], // #17202A
  muted: [100, 116, 139] as [number, number, number], // #64748B
  line: [226, 232, 240] as [number, number, number], // #E2E8F0
  rowAlt: [248, 250, 252] as [number, number, number], // #F8FAFC
  white: [255, 255, 255] as [number, number, number],
  pageBg: [248, 250, 252] as [number, number, number],
  cardBorder: [226, 232, 240] as [number, number, number],
  interest: [220, 38, 38] as [number, number, number],
  warnBg: [255, 247, 237] as [number, number, number],
  warnBorder: [251, 146, 60] as [number, number, number],
  warnText: [154, 52, 18] as [number, number, number],
};

const MARGIN = 40;
const FOOTER_RESERVE = 56;
const SITE_URL = "aaruwealth.com";
const DISCLAIMER_SHORT =
  "Illustrative only — not financial, tax or legal advice. Figures typically exclude inflation, taxes and fees unless stated.*";
const DISCLAIMER_FULL =
  "*Figures are illustrative estimates based on the inputs shown. They are not investment, tax or legal advice and do not guarantee outcomes. Unless explicitly modelled, projections exclude inflation, taxes, fees, exit loads and lender charges. Rounding may create a small residual in the final instalment.";

/**
 * Donut segment colours — same palette as the live FinancialDonutChart /
 * design-system brand (navy + accent teal), not arbitrary PDF-only hues.
 */
const SLICE_COLORS: [number, number, number][] = [
  COLORS.navy, // #0B1F33 — primary brand
  COLORS.turquoise, // #0F766E — accent
  COLORS.navyMid, // #263746 — slate
  [148, 163, 184], // muted slate fallback (#94A3B8)
];

function rgb(doc: jsPDF, c: [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}

function fill(doc: jsPDF, c: [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}

function stroke(doc: jsPDF, c: [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

function drawDonutPng(
  slices: { label: string; value: number; color?: string }[]
): string | null {
  if (typeof document === "undefined") return null;
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
  if (total <= 0) return null;

  // Extra canvas room for external % callouts (B&W / print friendly)
  const size = 520;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outer = size * 0.32;
  const inner = size * 0.18;
  const labelR = outer + 36;

  let start = -Math.PI / 2;
  slices.forEach((slice, i) => {
    const angle = (Math.max(0, slice.value) / total) * Math.PI * 2;
    const mid = start + angle / 2;
    // Always use site brand palette (ignore per-calculator overrides)
    const c = SLICE_COLORS[i % SLICE_COLORS.length];
    const fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();

    const pct = total > 0 ? (Math.max(0, slice.value) / total) * 100 : 0;
    if (pct >= 4) {
      const lx = cx + Math.cos(mid) * labelR;
      const ly = cy + Math.sin(mid) * labelR;
      const ix = cx + Math.cos(mid) * (outer + 4);
      const iy = cy + Math.sin(mid) * (outer + 4);

      ctx.strokeStyle = "#64748B";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ix, iy);
      ctx.lineTo(lx, ly);
      ctx.stroke();

      ctx.fillStyle = "#17202A";
      ctx.font = "bold 18px Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const pctLabel = `${pct.toFixed(0)}%`;
      ctx.fillText(pctLabel, lx, ly - 10);
      ctx.font = "13px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#64748B";
      const short =
        slice.label.length > 14 ? `${slice.label.slice(0, 12)}…` : slice.label;
      ctx.fillText(short, lx, ly + 12);
    }

    start += angle;
  });

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  return canvas.toDataURL("image/png");
}

/**
 * X-axis ticks for portfolio / balance charts.
 *
 * SIP-style series stores one point per year (length === years).
 * EMI-style series stores one point per month (length === years * 12).
 * Labels always reflect real calendar years of the horizon — never "Year 1…Year 2"
 * for a 20-year run.
 */
export function yearAxisTicks(
  pointCount: number,
  horizonYears?: number
): { index: number; label: string }[] {
  if (pointCount < 2) return [];

  const inferredMonthly =
    pointCount % 12 === 0 && pointCount / 12 >= 2 && pointCount >= 60;
  const totalYears = Math.max(
    1,
    Math.round(
      horizonYears != null && horizonYears > 0
        ? horizonYears
        : inferredMonthly
          ? pointCount / 12
          : pointCount
    )
  );

  const isAnnualSeries =
    horizonYears != null
      ? pointCount <= totalYears + 1
      : !inferredMonthly;

  const indexForYear = (year: number): number => {
    if (year <= 0) return 0;
    if (isAnnualSeries) {
      // index 0 = end of year 1, index N-1 = end of year N
      return Math.min(pointCount - 1, Math.max(0, year - 1));
    }
    // monthly: month 12 → index 11, month (year*12) → index year*12 - 1
    return Math.min(pointCount - 1, Math.max(0, year * 12 - 1));
  };

  const step =
    totalYears <= 5 ? 1 : totalYears <= 10 ? 2 : totalYears <= 30 ? 5 : 10;

  const years: number[] = [];
  for (let y = step; y < totalYears; y += step) years.push(y);
  if (!years.includes(totalYears)) years.push(totalYears);

  return years.map((year) => ({
    index: indexForYear(year),
    label: year === 1 ? "1 Year" : `${year} Years`,
  }));
}

function drawBalancePng(
  points: number[],
  titleHint?: string,
  horizonYears?: number
): string | null {
  if (typeof document === "undefined" || points.length < 2) return null;
  const w = 900;
  const h = 340;
  const pad = { t: 36, r: 28, b: 44, l: 72 };
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const maxY = Math.max(...points, 1);
  const minY = 0;
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;

  const xAt = (i: number) => pad.l + (plotW * i) / (points.length - 1);
  const yAt = (v: number) =>
    pad.t + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // Horizontal grid
  ctx.strokeStyle = "#e8ebf0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(w - pad.r, y);
    ctx.stroke();
  }

  const ticks = yearAxisTicks(points.length, horizonYears);

  // Vertical reference lines at year interval ticks
  ticks.forEach((tick) => {
    const x = xAt(tick.index);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, pad.t);
    ctx.lineTo(x, pad.t + plotH);
    ctx.stroke();
  });

  ctx.beginPath();
  points.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xAt(points.length - 1), pad.t + plotH);
  ctx.lineTo(xAt(0), pad.t + plotH);
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 118, 110, 0.12)";
  ctx.fill();

  ctx.beginPath();
  points.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#0B1F33";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#64748B";
  ctx.font = "11px Helvetica, Arial, sans-serif";
  const startVal = formatForPDF(points[0]);
  const endVal = formatForPDF(points[points.length - 1]);
  ctx.fillText(startVal, pad.l, pad.t - 10);
  ctx.fillText(
    endVal,
    w - pad.r - ctx.measureText(endVal).width,
    pad.t - 10
  );

  ctx.font = "11px Helvetica, Arial, sans-serif";
  ticks.forEach((tick) => {
    const x = xAt(tick.index);
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(x, pad.t + plotH);
    ctx.lineTo(x, pad.t + plotH + 5);
    ctx.stroke();
    const tw = ctx.measureText(tick.label).width;
    ctx.fillStyle = "#64748B";
    ctx.fillText(tick.label, x - tw / 2, h - 14);
  });

  if (titleHint) {
    ctx.fillStyle = "#1a1f2e";
    ctx.font = "bold 13px Helvetica, Arial, sans-serif";
    ctx.fillText(titleHint, pad.l, 16);
  }

  return canvas.toDataURL("image/png");
}

/** Load the site brand mark (favicon / app icon) for the PDF header. */
async function loadBrandMarkDataUrl(): Promise<string | null> {
  if (typeof document === "undefined") return null;
  const candidates = [
    "/android-chrome-192x192.png",
    "/apple-touch-icon.png",
    "/icon.png",
    "/favicon-32x32.png",
  ];
  for (const src of candidates) {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const size = 128;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("no canvas"));
            return;
          }
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("load failed"));
        img.src = src;
      });
      return dataUrl;
    } catch {
      /* try next */
    }
  }
  return null;
}

function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "S" | "F" | "FD" = "FD"
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

/**
 * jsPDF standard fonts (Helvetica) use WinAnsi and cannot encode ₹ (U+20B9),
 * which incorrectly renders as ¹. Embed a tiny Noto Sans subset for currency text.
 */
const UNICODE_FONT = "NotoSansRupee";
let pdfFontStyle: "normal" | "bold" = "normal";
let unicodeFontsReady = false;

function base64ToBinaryString(base64: string): string {
  if (typeof atob === "function") {
    return atob(base64);
  }
  const Buf = (
    globalThis as {
      Buffer?: {
        from(data: string, enc: string): { toString(enc: string): string };
      };
    }
  ).Buffer;
  if (Buf) {
    return Buf.from(base64, "base64").toString("binary");
  }
  throw new Error("No base64 decoder available");
}

function registerUnicodePdfFonts(doc: jsPDF) {
  const regular = base64ToBinaryString(NOTO_RUPEE_REGULAR_BASE64);
  const bold = base64ToBinaryString(NOTO_RUPEE_BOLD_BASE64);
  doc.addFileToVFS("NotoSans-Rupee.ttf", regular);
  doc.addFont("NotoSans-Rupee.ttf", UNICODE_FONT, "normal");
  doc.addFileToVFS("NotoSans-Rupee-Bold.ttf", bold);
  doc.addFont("NotoSans-Rupee-Bold.ttf", UNICODE_FONT, "bold");
  unicodeFontsReady = true;
}

function setPdfFont(doc: jsPDF, style: "normal" | "bold" = "normal") {
  pdfFontStyle = style;
  doc.setFont("helvetica", style);
}

function textHasRupee(text: string | string[]): boolean {
  if (Array.isArray(text)) return text.some((t) => t.includes("₹"));
  return text.includes("₹");
}

function pdfText(
  doc: jsPDF,
  text: string | string[],
  x: number,
  y: number,
  options?: Parameters<jsPDF["text"]>[3]
) {
  if (unicodeFontsReady && textHasRupee(text)) {
    doc.setFont(UNICODE_FONT, pdfFontStyle);
    doc.text(text, x, y, options);
    doc.setFont("helvetica", pdfFontStyle);
    return;
  }
  doc.text(text, x, y, options);
}

function pdfSplitTextToSize(doc: jsPDF, text: string, size: number): string[] {
  if (unicodeFontsReady && text.includes("₹")) {
    doc.setFont(UNICODE_FONT, pdfFontStyle);
    const lines = doc.splitTextToSize(text, size);
    doc.setFont("helvetica", pdfFontStyle);
    return lines;
  }
  return doc.splitTextToSize(text, size);
}

function sanitizeCell(value: string | number): string {
  const raw = normalizePdfMoneyText(String(value ?? ""));
  // Drop stray pipe artefacts from broken schedule layouts
  return raw
    .replace(/\|\s*\|/g, " ")
    .replace(/^\s*\|\s*|\s*\|\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectHighReturnPct(options: PremiumPdfOptions): number | null {
  if (
    typeof options.expectedReturnPct === "number" &&
    Number.isFinite(options.expectedReturnPct) &&
    options.expectedReturnPct > HIGH_RETURN_THRESHOLD_PCT
  ) {
    return options.expectedReturnPct;
  }
  for (const input of options.inputs) {
    if (!isInvestmentReturnInput(input.label)) continue;
    const pct = parsePercentFromLabelValue(input.value);
    if (pct != null && pct > HIGH_RETURN_THRESHOLD_PCT) return pct;
  }
  return null;
}

/** Normalize all money strings + expand compact K/L/Cr before drawing. */
function prepareOptions(options: PremiumPdfOptions): PremiumPdfOptions {
  const money = (s: string) => normalizePdfMoneyText(s);
  return {
    ...options,
    hero: options.hero
      ? {
          ...options.hero,
          value: money(options.hero.value),
          hint: options.hero.hint ? money(options.hero.hint) : undefined,
        }
      : undefined,
    inputs: options.inputs.map((i) => ({
      ...i,
      value: money(i.value),
    })),
    results: options.results.map((r) => ({
      ...r,
      value: money(r.value),
    })),
    journey: options.journey?.map(money),
    table: options.table
      ? {
          ...options.table,
          rows: options.table.rows.map((row) => {
            const next: PdfTableRow = {};
            for (const [k, v] of Object.entries(row)) {
              next[k] = typeof v === "string" ? sanitizeCell(v) : v;
            }
            return next;
          }),
        }
      : undefined,
  };
}

/**
 * Collapse monthly schedule rows into one clean year-end summary per year.
 * Fixes sparse/broken month layouts and empty pipe columns.
 */
function buildAnnualSummaryTable(
  columns: PdfTableColumn[],
  rows: PdfTableRow[],
  monthKey: string
): { columns: PdfTableColumn[]; rows: PdfTableRow[] } {
  const byYear = new Map<number, PdfTableRow[]>();
  rows.forEach((row) => {
    const m = Number(row[monthKey]);
    const year = Number.isFinite(m) && m > 0 ? Math.ceil(m / 12) : 1;
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(row);
  });

  const yearColKey = monthKey;
  const annualCols = columns.map((c) =>
    c.key === monthKey || /month|mo/i.test(c.header)
      ? { ...c, header: "Year", key: yearColKey }
      : c
  );

  const annualRows: PdfTableRow[] = [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearRows]) => {
      const last = yearRows[yearRows.length - 1];
      const out: PdfTableRow = { ...last };
      out[yearColKey] = `Year ${year}`;
      // Ensure every declared column has a clean string (no blanks / pipes)
      annualCols.forEach((col) => {
        if (out[col.key] == null || out[col.key] === "") {
          out[col.key] = "—";
        } else {
          out[col.key] = sanitizeCell(out[col.key]);
        }
      });
      return out;
    });

  return { columns: annualCols, rows: annualRows };
}

export async function generatePremiumPdf(
  options: PremiumPdfOptions
): Promise<void> {
  const prepared = prepareOptions(options);
  const highReturnPct = detectHighReturnPct(options);
  const brandMark = await loadBrandMarkDataUrl();

  const doc = new jsPDF({ unit: "pt", format: "a4", putOnlyUsedFonts: true });
  registerUnicodePdfFonts(doc);
  pdfFontStyle = "normal";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentW = pageWidth - MARGIN * 2;
  let y = 0;

  const generated = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const drawFooter = () => {
    const footerTop = pageHeight - FOOTER_RESERVE;
    stroke(doc, COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, footerTop, pageWidth - MARGIN, footerTop);

    setPdfFont(doc, "normal");
    doc.setFontSize(7.5);
    rgb(doc, COLORS.muted);
    pdfText(doc, SITE_URL, MARGIN, footerTop + 12);
    pdfText(doc, generated, pageWidth / 2, footerTop + 12, { align: "center" });
    // page numbers filled in final pass (right side)

    const discLines = doc.splitTextToSize(DISCLAIMER_SHORT, contentW);
    doc.setFontSize(6.5);
    pdfText(doc, discLines.slice(0, 2), MARGIN, footerTop + 26);
  };

  const paintPageBackground = () => {
    fill(doc, COLORS.pageBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  const newPage = () => {
    drawFooter();
    doc.addPage();
    paintPageBackground();
    y = MARGIN;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - FOOTER_RESERVE - 8) newPage();
  };

  // —— PAGE 1 HEADER (brand mark + title; timestamp is in the footer) ——
  paintPageBackground();
  fill(doc, COLORS.navy);
  doc.rect(0, 0, pageWidth, 92, "F");
  fill(doc, COLORS.turquoise);
  doc.rect(0, 92, pageWidth, 3, "F");

  const logoSize = 36;
  const textLeft = brandMark ? MARGIN + logoSize + 12 : MARGIN;
  if (brandMark) {
    // White plate so the transparent navy/gold mark stays legible on navy header
    fill(doc, COLORS.white);
    doc.roundedRect(MARGIN, 18, logoSize + 8, logoSize + 8, 6, 6, "F");
    doc.addImage(
      brandMark,
      "PNG",
      MARGIN + 4,
      22,
      logoSize,
      logoSize
    );
  }

  setPdfFont(doc, "bold");
  doc.setFontSize(11);
  rgb(doc, COLORS.turquoise);
  pdfText(doc, SITE_NAME.toUpperCase(), textLeft, 28);

  setPdfFont(doc, "normal");
  doc.setFontSize(8);
  rgb(doc, [180, 190, 210]);
  pdfText(doc, SITE_TAGLINE, textLeft, 42);

  setPdfFont(doc, "bold");
  doc.setFontSize(20);
  rgb(doc, COLORS.white);
  pdfText(doc, prepared.title, MARGIN, 68);

  y = 112;

  if (prepared.tagline) {
    setPdfFont(doc, "normal");
    doc.setFontSize(11);
    rgb(doc, COLORS.muted);
    pdfText(doc, prepared.tagline, MARGIN, y);
    y += 18;
  } else if (prepared.subtitle) {
    setPdfFont(doc, "normal");
    doc.setFontSize(10);
    rgb(doc, COLORS.muted);
    // Strip trailing brand duplication like "— Aaru Wealth" from subtitles
    const cleanSub = prepared.subtitle
      .replace(/\s*[—–-]\s*Aaru Wealth\s*$/i, "")
      .trim();
    if (cleanSub) {
      pdfText(doc, cleanSub, MARGIN, y);
      y += 16;
    }
  }

  // —— HERO ——
  const hero =
    prepared.hero ??
    (prepared.results[0]
      ? {
          label: prepared.results[0].label,
          value: prepared.results[0].value,
          hint: undefined as string | undefined,
        }
      : null);

  if (hero) {
    ensureSpace(88);
    fill(doc, COLORS.navy);
    drawRoundedRect(doc, MARGIN, y, contentW, 78, 10, "F");
    fill(doc, COLORS.turquoise);
    doc.roundedRect(MARGIN, y, 6, 78, 3, 3, "F");

    setPdfFont(doc, "bold");
    doc.setFontSize(9);
    rgb(doc, COLORS.turquoise);
    pdfText(doc, `${hero.label.toUpperCase()}*`, MARGIN + 22, y + 24);

    setPdfFont(doc, "bold");
    doc.setFontSize(26);
    rgb(doc, COLORS.white);
    pdfText(doc, hero.value, MARGIN + 22, y + 54);

    if (hero.hint) {
      setPdfFont(doc, "normal");
      doc.setFontSize(9);
      rgb(doc, [180, 190, 210]);
      pdfText(doc, hero.hint, pageWidth - MARGIN - 16, y + 54, {
        align: "right",
      });
    }
    y += 94;
  }

  // —— HIGH RETURN WARNING ——
  if (highReturnPct != null) {
    ensureSpace(70);
    fill(doc, COLORS.warnBg);
    stroke(doc, COLORS.warnBorder);
    doc.setLineWidth(1);
    drawRoundedRect(doc, MARGIN, y, contentW, 58, 8, "FD");
    setPdfFont(doc, "bold");
    doc.setFontSize(9);
    rgb(doc, COLORS.warnText);
    pdfText(
      doc,
      `HIGH-RETURN REALITY CHECK · ${highReturnPct.toFixed(1)}% p.a. assumed`,
      MARGIN + 12,
      y + 16
    );
    setPdfFont(doc, "normal");
    doc.setFontSize(8);
    const warnLines = pdfSplitTextToSize(
      doc,
      HIGH_RETURN_WARNING,
      contentW - 24
    );
    pdfText(doc, warnLines.slice(0, 3), MARGIN + 12, y + 32);
    y += 70;
  }

  // —— INPUT SUMMARY CARDS ——
  if (prepared.inputs.length > 0) {
    ensureSpace(90);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc, "SUMMARY", MARGIN, y);
    y += 12;

    const n = Math.min(prepared.inputs.length, 4);
    const gap = 10;
    const cardW = (contentW - gap * (n - 1)) / n;
    const cardH = 58;
    prepared.inputs.slice(0, n).forEach((input, i) => {
      const x = MARGIN + i * (cardW + gap);
      fill(doc, COLORS.white);
      stroke(doc, COLORS.cardBorder);
      doc.setLineWidth(0.8);
      drawRoundedRect(doc, x, y, cardW, cardH, 8, "FD");
      setPdfFont(doc, "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      pdfText(doc, input.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      setPdfFont(doc, "bold");
      doc.setFontSize(12);
      rgb(doc, COLORS.ink);
      pdfText(doc, String(input.value), x + 12, y + 40, {
        maxWidth: cardW - 20,
      });
    });
    y += cardH + 18;
  }

  // —— RESULTS / BREAKDOWN ——
  const breakdown = prepared.results.filter(
    (r) => !hero || r.label.toLowerCase() !== hero.label.toLowerCase()
  );
  if (breakdown.length > 0) {
    ensureSpace(90);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc, "KEY RESULTS", MARGIN, y);
    y += 12;

    const n = Math.min(breakdown.length, 3);
    const gap = 10;
    const cardW = (contentW - gap * (n - 1)) / n;
    const cardH = 58;
    breakdown.slice(0, n).forEach((row, i) => {
      const x = MARGIN + i * (cardW + gap);
      fill(doc, COLORS.white);
      stroke(doc, COLORS.cardBorder);
      doc.setLineWidth(0.8);
      drawRoundedRect(doc, x, y, cardW, cardH, 8, "FD");
      setPdfFont(doc, "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      pdfText(doc, row.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      setPdfFont(doc, "bold");
      doc.setFontSize(13);
      rgb(doc, i === 0 ? COLORS.navy : COLORS.ink);
      pdfText(doc, String(row.value), x + 12, y + 40, {
        maxWidth: cardW - 20,
      });
    });
    y += cardH + 10;

    if (breakdown.length > n) {
      breakdown.slice(n).forEach((row) => {
        ensureSpace(16);
        setPdfFont(doc, "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        pdfText(doc, row.label, MARGIN, y);
        setPdfFont(doc, "bold");
        rgb(doc, COLORS.ink);
        pdfText(doc, String(row.value), pageWidth - MARGIN, y, {
          align: "right",
        });
        y += 14;
      });
      y += 6;
    } else {
      y += 8;
    }
  }

  // —— DONUT + LEGEND ——
  if (prepared.chartSlices && prepared.chartSlices.length >= 2) {
    const png = drawDonutPng(prepared.chartSlices);
    if (png) {
      ensureSpace(170);
      setPdfFont(doc, "bold");
      doc.setFontSize(11);
      rgb(doc, COLORS.ink);
      pdfText(doc, "BREAKDOWN", MARGIN, y);
      y += 8;

      const chartSize = 132;
      const chartX = MARGIN;
      doc.addImage(png, "PNG", chartX, y, chartSize, chartSize);

      const total = prepared.chartSlices.reduce(
        (s, x) => s + Math.max(0, x.value),
        0
      );
      let ly = y + 28;
      prepared.chartSlices.forEach((slice, i) => {
        const c = SLICE_COLORS[i % SLICE_COLORS.length];
        fill(doc, c);
        doc.circle(MARGIN + chartSize + 28, ly - 3, 4, "F");
        setPdfFont(doc, "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        pdfText(doc, slice.label, MARGIN + chartSize + 40, ly);
        setPdfFont(doc, "bold");
        rgb(doc, COLORS.ink);
        const pct = total > 0 ? ((slice.value / total) * 100).toFixed(1) : "0";
        pdfText(
          doc,
          `${formatForPDF(slice.value)}  (${pct}%)`,
          MARGIN + chartSize + 40,
          ly + 12
        );
        ly += 32;
      });
      y += chartSize + 16;
    }
  }

  // —— INVESTMENT TIMELINE (formerly JOURNEY) ——
  if (prepared.journey && prepared.journey.length >= 2) {
    ensureSpace(56);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc, "INVESTMENT TIMELINE", MARGIN, y);
    y += 14;

    const steps = prepared.journey;
    const stepW = contentW / steps.length;
    steps.forEach((step, i) => {
      const cx = MARGIN + stepW * i + stepW / 2;
      fill(doc, i === steps.length - 1 ? COLORS.turquoise : COLORS.navy);
      doc.circle(cx, y + 6, 5, "F");
      if (i < steps.length - 1) {
        stroke(doc, COLORS.line);
        doc.setLineWidth(1.2);
        doc.line(cx + 8, y + 6, cx + stepW - 8, y + 6);
      }
      setPdfFont(doc, "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.ink);
      const lines = pdfSplitTextToSize(doc, step, stepW - 8);
      pdfText(doc, lines, cx, y + 22, { align: "center" });
    });
    y += 48;
  }

  // —— BALANCE / PORTFOLIO CHART ——
  const maybeBalance = () => {
    if (!prepared.balanceSeries || prepared.balanceSeries.length < 2) return;
    const png = drawBalancePng(
      prepared.balanceSeries,
      prepared.balanceChartTitle ?? "Portfolio value over time",
      prepared.balanceSeriesYears
    );
    if (!png) return;
    ensureSpace(160);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(
      doc,
      (prepared.balanceChartTitle ?? "PORTFOLIO VALUE OVER TIME").toUpperCase(),
      MARGIN,
      y
    );
    y += 8;
    fill(doc, COLORS.white);
    stroke(doc, COLORS.cardBorder);
    drawRoundedRect(doc, MARGIN, y, contentW, 138, 8, "FD");
    doc.addImage(png, "PNG", MARGIN + 8, y + 6, contentW - 16, 126);
    y += 150;
  };

  if (y > pageHeight - 200) {
    newPage();
  }
  maybeBalance();

  // —— TABLE (annual summary when monthly schedule) ——
  if (prepared.table && prepared.table.rows.length > 0) {
    const maxRows = prepared.table.maxRows ?? 400;
    const monthKey =
      prepared.table.monthKey ??
      prepared.table.columns.find(
        (c) => /month|mo/i.test(c.header) || c.key === "month"
      )?.key;

    let cols = prepared.table.columns;
    let allRows = prepared.table.rows.slice(0, maxRows);

    if (prepared.table.groupByYear && monthKey) {
      const annual = buildAnnualSummaryTable(cols, allRows, monthKey);
      cols = annual.columns;
      allRows = annual.rows;
    }

    ensureSpace(40);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    const tableTitle =
      prepared.table.groupByYear && monthKey
        ? (prepared.table.title ?? "Annual summary").replace(
            /detailed schedule/i,
            "Annual summary"
          )
        : (prepared.table.title ?? "DETAILED SCHEDULE");
    pdfText(doc, tableTitle.toUpperCase(), MARGIN, y);
    y += 14;

    const usable = contentW;
    const weights = cols.map((c, i) =>
      i === 0 && /year|month|mo/i.test(c.header) ? 0.75 : 1
    );
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const colWs = weights.map((w) => (usable * w) / weightSum);
    const rowH = 14;
    const headerH = 18;

    const drawTableHeader = () => {
      const headerTop = y;
      fill(doc, COLORS.navy);
      doc.rect(MARGIN, headerTop, contentW, headerH, "F");
      stroke(doc, COLORS.navy);
      doc.setLineWidth(0.6);
      doc.rect(MARGIN, headerTop, contentW, headerH, "S");

      setPdfFont(doc, "bold");
      doc.setFontSize(8);
      rgb(doc, COLORS.white);
      let x = MARGIN;
      cols.forEach((col, i) => {
        const align = i === 0 ? "left" : "right";
        const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
        pdfText(doc, col.header, tx, headerTop + 12, { align });
        // Vertical column rules through header
        if (i > 0) {
          stroke(doc, COLORS.white);
          doc.setLineWidth(0.4);
          doc.line(x, headerTop, x, headerTop + headerH);
        }
        x += colWs[i];
      });
      // Outer border in navy already stroked; restore ink stroke for body
      stroke(doc, COLORS.cardBorder);
      y = headerTop + headerH;
    };

    drawTableHeader();

    allRows.forEach((row, ri) => {
      ensureSpace(rowH + 4);
      if (y > pageHeight - FOOTER_RESERVE - 12) {
        newPage();
        drawTableHeader();
      }
      const rowTop = y;
      if (ri % 2 === 1) {
        fill(doc, COLORS.rowAlt);
        doc.rect(MARGIN, rowTop, contentW, rowH, "F");
      }

      setPdfFont(doc, "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.ink);
      let x = MARGIN;
      cols.forEach((col, i) => {
        const cell = sanitizeCell(row[col.key] ?? "—");
        const align = i === 0 ? "left" : "right";
        const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
        pdfText(doc, cell, tx, rowTop + 10, {
          align,
          maxWidth: colWs[i] - 10,
        });
        x += colWs[i];
      });

      // Full cell grid: outer + vertical + bottom horizontal
      stroke(doc, COLORS.cardBorder);
      doc.setLineWidth(0.5);
      doc.rect(MARGIN, rowTop, contentW, rowH, "S");
      x = MARGIN;
      for (let i = 0; i < cols.length - 1; i++) {
        x += colWs[i];
        doc.line(x, rowTop, x, rowTop + rowH);
      }
      y = rowTop + rowH;
    });
    y += 10;
  }

  // Full disclosure (end of document — linked from hero *)
  ensureSpace(56);
  setPdfFont(doc, "bold");
  doc.setFontSize(9);
  rgb(doc, COLORS.ink);
  pdfText(doc, "DISCLOSURE", MARGIN, y);
  y += 12;
  setPdfFont(doc, "normal");
  doc.setFontSize(7.5);
  rgb(doc, COLORS.muted);
  const disclaimer = doc.splitTextToSize(DISCLAIMER_FULL, contentW);
  pdfText(doc, disclaimer, MARGIN, y);
  y += disclaimer.length * 10 + 8;

  drawFooter();

  // Page numbers (right side of footer)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setPdfFont(doc, "normal");
    doc.setFontSize(7.5);
    rgb(doc, COLORS.muted);
    pdfText(
      doc,
      `Page ${i} of ${totalPages}`,
      pageWidth - MARGIN,
      pageHeight - FOOTER_RESERVE + 12,
      { align: "right" }
    );
  }

  const safeName =
    prepared.fileName ??
    `${prepared.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}.pdf`;
  doc.save(safeName);
}
