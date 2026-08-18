import { jsPDF } from "jspdf";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import {
  NOTO_RUPEE_BOLD_BASE64,
  NOTO_RUPEE_REGULAR_BASE64,
} from "@/lib/pdf/noto-rupee-font-data";

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
  journey?: string[];
  table?: {
    columns: PdfTableColumn[];
    rows: PdfTableRow[];
    maxRows?: number;
    title?: string;
    /** Group amortization by year when a month column exists */
    groupByYear?: boolean;
    monthKey?: string;
  };
  fileName?: string;
};

const COLORS = {
  navy: [8, 59, 122] as [number, number, number],
  navyMid: [11, 94, 215] as [number, number, number],
  gold: [11, 94, 215] as [number, number, number],
  turquoise: [25, 135, 84] as [number, number, number],
  ink: [23, 32, 51] as [number, number, number],
  muted: [102, 112, 133] as [number, number, number],
  line: [208, 213, 221] as [number, number, number],
  rowAlt: [245, 249, 255] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  pageBg: [245, 249, 255] as [number, number, number],
  cardBorder: [208, 213, 221] as [number, number, number],
  interest: [220, 53, 69] as [number, number, number],
};

const MARGIN = 40;
const SLICE_COLORS: [number, number, number][] = [
  COLORS.navy,
  COLORS.gold,
  COLORS.turquoise,
  COLORS.interest,
  [90, 120, 180],
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

  const size = 420;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outer = size * 0.38;
  const inner = size * 0.22;

  let start = -Math.PI / 2;
  slices.forEach((slice, i) => {
    const angle = (Math.max(0, slice.value) / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, start, start + angle);
    ctx.closePath();
    const c = SLICE_COLORS[i % SLICE_COLORS.length];
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    if (slice.color?.startsWith("#") && slice.color.length >= 7) {
      ctx.fillStyle = slice.color;
    }
    ctx.fill();
    start += angle;
  });

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  return canvas.toDataURL("image/png");
}

function drawBalancePng(points: number[], titleHint?: string): string | null {
  if (typeof document === "undefined" || points.length < 2) return null;
  const w = 900;
  const h = 320;
  const pad = { t: 28, r: 24, b: 36, l: 56 };
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

  // grid
  ctx.strokeStyle = "#e8ebf0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(w - pad.r, y);
    ctx.stroke();
  }

  const xAt = (i: number) => pad.l + (plotW * i) / (points.length - 1);
  const yAt = (v: number) =>
    pad.t + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // area fill
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
  ctx.fillStyle = "rgba(11, 94, 215, 0.12)";
  ctx.fill();

  // line
  ctx.beginPath();
  points.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#083B7A";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#646e82";
  ctx.font = "12px Helvetica, Arial, sans-serif";
  ctx.fillText(formatCompact(points[0]), pad.l, pad.t - 8);
  const endLabel = formatCompact(points[points.length - 1]);
  ctx.fillText(endLabel, w - pad.r - ctx.measureText(endLabel).width, pad.t - 8);
  ctx.fillText("Start", pad.l, h - 12);
  ctx.fillText("End", w - pad.r - 22, h - 12);
  if (titleHint) {
    ctx.fillStyle = "#1a1f2e";
    ctx.font = "bold 13px Helvetica, Arial, sans-serif";
    ctx.fillText(titleHint, pad.l, 16);
  }

  return canvas.toDataURL("image/png");
}

function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
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
  // Prefer browser atob; fall back for Node/test environments.
  if (typeof atob === "function") {
    return atob(base64);
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return Buffer.from(base64, "base64").toString("binary");
}

function registerUnicodePdfFonts(doc: jsPDF) {
  // Each jsPDF instance has its own VFS — register on every document.
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

/** Draw text; use embedded Unicode font when the string contains ₹. */
function pdfText(
  doc: jsPDF,
  text: string | string[],
  x: number,
  y: number,
  options?: Parameters<jsPDF["text"]>[3]
) {
  if (unicodeFontsReady && textHasRupee(text)) {
    doc.setFont(UNICODE_FONT, pdfFontStyle);
    // Use instance method — jsPDF.prototype.text is undefined in some bundles.
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

export async function generatePremiumPdf(
  options: PremiumPdfOptions
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4", putOnlyUsedFonts: true });
  registerUnicodePdfFonts(doc);
  pdfFontStyle = "normal";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentW = pageWidth - MARGIN * 2;
  let y = 0;
  let pageIndex = 1;

  const generated = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const drawFooter = () => {
    const footerY = pageHeight - 22;
    stroke(doc, COLORS.line);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, footerY - 10, pageWidth - MARGIN, footerY - 10);
    setPdfFont(doc, "normal");
    doc.setFontSize(8);
    rgb(doc, COLORS.muted);
    pdfText(doc,SITE_NAME, MARGIN, footerY);
    pdfText(doc,options.title, pageWidth / 2, footerY, { align: "center" });
    // page numbers filled at end
  };

  const paintPageBackground = () => {
    fill(doc, COLORS.pageBg);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  const newPage = () => {
    drawFooter();
    doc.addPage();
    pageIndex += 1;
    paintPageBackground();
    y = MARGIN;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) newPage();
  };

  // —— PAGE 1 HEADER ——
  paintPageBackground();
  fill(doc, COLORS.navy);
  doc.rect(0, 0, pageWidth, 92, "F");
  fill(doc, COLORS.gold);
  doc.rect(0, 92, pageWidth, 3, "F");

  setPdfFont(doc, "bold");
  doc.setFontSize(11);
  rgb(doc, COLORS.gold);
  pdfText(doc,SITE_NAME.toUpperCase(), MARGIN, 28);

  setPdfFont(doc, "normal");
  doc.setFontSize(8);
  rgb(doc, [180, 190, 210]);
  pdfText(doc,SITE_TAGLINE, MARGIN, 42);

  setPdfFont(doc, "bold");
  doc.setFontSize(20);
  rgb(doc, COLORS.white);
  pdfText(doc,options.title, MARGIN, 68);

  setPdfFont(doc, "normal");
  doc.setFontSize(8);
  rgb(doc, [160, 170, 190]);
  pdfText(doc,generated, pageWidth - MARGIN, 28, { align: "right" });

  y = 112;

  if (options.tagline) {
    setPdfFont(doc, "normal");
    doc.setFontSize(11);
    rgb(doc, COLORS.muted);
    pdfText(doc,options.tagline, MARGIN, y);
    y += 18;
  } else if (options.subtitle) {
    setPdfFont(doc, "normal");
    doc.setFontSize(10);
    rgb(doc, COLORS.muted);
    pdfText(doc,options.subtitle, MARGIN, y);
    y += 16;
  }

  // —— HERO ——
  const hero =
    options.hero ??
    (options.results[0]
      ? {
          label: options.results[0].label,
          value: options.results[0].value,
          hint: undefined as string | undefined,
        }
      : null);

  if (hero) {
    ensureSpace(88);
    fill(doc, COLORS.navy);
    drawRoundedRect(doc, MARGIN, y, contentW, 78, 10, "F");
    fill(doc, COLORS.gold);
    doc.roundedRect(MARGIN, y, 6, 78, 3, 3, "F");

    setPdfFont(doc, "bold");
    doc.setFontSize(9);
    rgb(doc, COLORS.gold);
    pdfText(doc,hero.label.toUpperCase(), MARGIN + 22, y + 24);

    setPdfFont(doc, "bold");
    doc.setFontSize(28);
    rgb(doc, COLORS.white);
    pdfText(doc,hero.value, MARGIN + 22, y + 54);

    if (hero.hint) {
      setPdfFont(doc, "normal");
      doc.setFontSize(9);
      rgb(doc, [180, 190, 210]);
      pdfText(doc,hero.hint, pageWidth - MARGIN - 16, y + 54, { align: "right" });
    }
    y += 94;
  }

  // —— INPUT SUMMARY CARDS ——
  if (options.inputs.length > 0) {
    ensureSpace(90);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc,"SUMMARY", MARGIN, y);
    y += 12;

    const n = Math.min(options.inputs.length, 4);
    const gap = 10;
    const cardW = (contentW - gap * (n - 1)) / n;
    const cardH = 58;
    options.inputs.slice(0, n).forEach((input, i) => {
      const x = MARGIN + i * (cardW + gap);
      fill(doc, COLORS.white);
      stroke(doc, COLORS.cardBorder);
      doc.setLineWidth(0.8);
      drawRoundedRect(doc, x, y, cardW, cardH, 8, "FD");
      setPdfFont(doc, "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      pdfText(doc,input.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      setPdfFont(doc, "bold");
      doc.setFontSize(12);
      rgb(doc, COLORS.ink);
      pdfText(doc,String(input.value), x + 12, y + 40, {
        maxWidth: cardW - 20,
      });
    });
    y += cardH + 18;
  }

  // —— RESULTS / BREAKDOWN ——
  const breakdown = options.results.filter(
    (r) => !hero || r.label.toLowerCase() !== hero.label.toLowerCase()
  );
  if (breakdown.length > 0) {
    ensureSpace(90);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc,"KEY RESULTS", MARGIN, y);
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
      pdfText(doc,row.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      setPdfFont(doc, "bold");
      doc.setFontSize(13);
      rgb(doc, i === 0 ? COLORS.navy : COLORS.ink);
      pdfText(doc,String(row.value), x + 12, y + 40, { maxWidth: cardW - 20 });
    });
    y += cardH + 10;

    // remaining results as compact rows
    if (breakdown.length > n) {
      breakdown.slice(n).forEach((row) => {
        ensureSpace(16);
        setPdfFont(doc, "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        pdfText(doc,row.label, MARGIN, y);
        setPdfFont(doc, "bold");
        rgb(doc, COLORS.ink);
        pdfText(doc,String(row.value), pageWidth - MARGIN, y, { align: "right" });
        y += 14;
      });
      y += 6;
    } else {
      y += 8;
    }
  }

  // —— DONUT + LEGEND ——
  if (options.chartSlices && options.chartSlices.length >= 2) {
    const png = drawDonutPng(options.chartSlices);
    if (png) {
      ensureSpace(160);
      setPdfFont(doc, "bold");
      doc.setFontSize(11);
      rgb(doc, COLORS.ink);
      pdfText(doc,"BREAKDOWN", MARGIN, y);
      y += 8;

      const chartSize = 120;
      const chartX = MARGIN;
      doc.addImage(png, "PNG", chartX, y, chartSize, chartSize);

      const total = options.chartSlices.reduce(
        (s, x) => s + Math.max(0, x.value),
        0
      );
      let ly = y + 28;
      options.chartSlices.forEach((slice, i) => {
        const c = SLICE_COLORS[i % SLICE_COLORS.length];
        fill(doc, c);
        doc.circle(MARGIN + chartSize + 28, ly - 3, 4, "F");
        setPdfFont(doc, "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        pdfText(doc,slice.label, MARGIN + chartSize + 40, ly);
        setPdfFont(doc, "bold");
        rgb(doc, COLORS.ink);
        const pct = total > 0 ? ((slice.value / total) * 100).toFixed(1) : "0";
        pdfText(doc,
          `${formatCompact(slice.value)}  (${pct}%)`,
          MARGIN + chartSize + 40,
          ly + 12
        );
        ly += 32;
      });
      y += chartSize + 16;
    }
  }

  // —— JOURNEY ——
  if (options.journey && options.journey.length >= 2) {
    ensureSpace(56);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc,"JOURNEY", MARGIN, y);
    y += 14;

    const steps = options.journey;
    const stepW = contentW / steps.length;
    steps.forEach((step, i) => {
      const cx = MARGIN + stepW * i + stepW / 2;
      fill(doc, i === steps.length - 1 ? COLORS.gold : COLORS.navy);
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

  // —— BALANCE CHART (prefer page 2 if crowded) ——
  const maybeBalance = () => {
    if (!options.balanceSeries || options.balanceSeries.length < 2) return;
    const png = drawBalancePng(
      options.balanceSeries,
      options.balanceChartTitle ?? "Outstanding balance over time"
    );
    if (!png) return;
    ensureSpace(150);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc,
      (options.balanceChartTitle ?? "OUTSTANDING BALANCE").toUpperCase(),
      MARGIN,
      y
    );
    y += 8;
    fill(doc, COLORS.white);
    stroke(doc, COLORS.cardBorder);
    drawRoundedRect(doc, MARGIN, y, contentW, 128, 8, "FD");
    doc.addImage(png, "PNG", MARGIN + 8, y + 6, contentW - 16, 116);
    y += 140;
  };

  // If little room left on page 1, put chart+table on next pages
  if (y > pageHeight - 200) {
    newPage();
  }
  maybeBalance();

  // —— TABLE ——
  if (options.table && options.table.rows.length > 0) {
    const maxRows = options.table.maxRows ?? 400;
    const allRows = options.table.rows.slice(0, maxRows);
    const cols = options.table.columns;
    const monthKey =
      options.table.monthKey ??
      cols.find((c) => /month|mo/i.test(c.header) || c.key === "month")?.key;

    type Group = { title?: string; rows: PdfTableRow[] };
    const groups: Group[] = [];
    if (options.table.groupByYear && monthKey) {
      const byYear = new Map<number, PdfTableRow[]>();
      allRows.forEach((row) => {
        const m = Number(row[monthKey]);
        const year = Number.isFinite(m) ? Math.ceil(m / 12) : 1;
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push(row);
      });
      [...byYear.entries()]
        .sort((a, b) => a[0] - b[0])
        .forEach(([year, rows]) => {
          const start = (year - 1) * 12 + 1;
          const end = Math.min(year * 12, Number(rows[rows.length - 1]?.[monthKey] ?? year * 12));
          groups.push({
            title: `YEAR ${year}  ·  Months ${start}–${end}`,
            rows,
          });
        });
    } else {
      groups.push({ rows: allRows });
    }

    ensureSpace(40);
    setPdfFont(doc, "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    pdfText(doc,(options.table.title ?? "DETAILED SCHEDULE").toUpperCase(), MARGIN, y);
    y += 14;

    const colCount = cols.length;
    const usable = contentW;
    // weight first col smaller if month
    const weights = cols.map((c, i) =>
      i === 0 && /month|mo/i.test(c.header) ? 0.7 : 1
    );
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const colWs = weights.map((w) => (usable * w) / weightSum);

    const drawTableHeader = () => {
      fill(doc, COLORS.navy);
      drawRoundedRect(doc, MARGIN, y - 10, contentW, 18, 3, "F");
      setPdfFont(doc, "bold");
      doc.setFontSize(8);
      rgb(doc, COLORS.white);
      let x = MARGIN;
      cols.forEach((col, i) => {
        const align = i === 0 ? "left" : "right";
        const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
        pdfText(doc,col.header, tx, y, { align });
        x += colWs[i];
      });
      y += 14;
    };

    groups.forEach((group) => {
      ensureSpace(36);
      if (group.title) {
        setPdfFont(doc, "bold");
        doc.setFontSize(9);
        rgb(doc, COLORS.navy);
        pdfText(doc,group.title, MARGIN, y);
        y += 12;
      }
      drawTableHeader();

      group.rows.forEach((row, ri) => {
        ensureSpace(16);
        if (y > pageHeight - 50) {
          newPage();
          if (group.title) {
            setPdfFont(doc, "bold");
            doc.setFontSize(9);
            rgb(doc, COLORS.navy);
            pdfText(doc,`${group.title} (continued)`, MARGIN, y);
            y += 12;
          }
          drawTableHeader();
        }
        if (ri % 2 === 1) {
          fill(doc, COLORS.rowAlt);
          doc.rect(MARGIN, y - 9, contentW, 13, "F");
        }
        setPdfFont(doc, "normal");
        doc.setFontSize(8);
        rgb(doc, COLORS.ink);
        let x = MARGIN;
        cols.forEach((col, i) => {
          const cell = String(row[col.key] ?? "");
          const align = i === 0 ? "left" : "right";
          const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
          pdfText(doc,cell, tx, y, { align, maxWidth: colWs[i] - 10 });
          x += colWs[i];
        });
        y += 13;
      });
      y += 10;
    });

    if (options.table.rows.length > maxRows) {
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      pdfText(doc,
        `Showing first ${maxRows} of ${options.table.rows.length} rows.`,
        MARGIN,
        y
      );
      y += 12;
    }
  }

  // Disclaimer
  ensureSpace(40);
  setPdfFont(doc, "normal");
  doc.setFontSize(7.5);
  rgb(doc, COLORS.muted);
  const disclaimer = doc.splitTextToSize(
    "Illustrative estimate based on the inputs shown. Not investment, tax or legal advice. Rounding may create a small residual in the final instalment. © " +
      SITE_NAME,
    contentW
  );
  pdfText(doc,disclaimer, MARGIN, y);

  drawFooter();

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setPdfFont(doc, "normal");
    doc.setFontSize(8);
    rgb(doc, COLORS.muted);
    pdfText(doc,`Page ${i} of ${totalPages}`, pageWidth - MARGIN, pageHeight - 22, {
      align: "right",
    });
  }

  const safeName =
    options.fileName ??
    `${options.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}.pdf`;
  doc.save(safeName);
}
