import { jsPDF } from "jspdf";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

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
  navy: [19, 25, 43] as [number, number, number],
  navyMid: [31, 41, 58] as [number, number, number],
  gold: [247, 198, 21] as [number, number, number],
  turquoise: [38, 214, 198] as [number, number, number],
  ink: [26, 31, 46] as [number, number, number],
  muted: [100, 110, 130] as [number, number, number],
  line: [220, 224, 232] as [number, number, number],
  rowAlt: [246, 247, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  pageBg: [250, 251, 253] as [number, number, number],
  cardBorder: [230, 233, 240] as [number, number, number],
  interest: [220, 100, 90] as [number, number, number],
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
  ctx.fillStyle = "rgba(247, 198, 21, 0.15)";
  ctx.fill();

  // line
  ctx.beginPath();
  points.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#13192B";
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

export function generatePremiumPdf(options: PremiumPdfOptions): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
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
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    rgb(doc, COLORS.muted);
    doc.text(SITE_NAME, MARGIN, footerY);
    doc.text(options.title, pageWidth / 2, footerY, { align: "center" });
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  rgb(doc, COLORS.gold);
  doc.text(SITE_NAME.toUpperCase(), MARGIN, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  rgb(doc, [180, 190, 210]);
  doc.text(SITE_TAGLINE, MARGIN, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  rgb(doc, COLORS.white);
  doc.text(options.title, MARGIN, 68);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  rgb(doc, [160, 170, 190]);
  doc.text(generated, pageWidth - MARGIN, 28, { align: "right" });

  y = 112;

  if (options.tagline) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    rgb(doc, COLORS.muted);
    doc.text(options.tagline, MARGIN, y);
    y += 18;
  } else if (options.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    rgb(doc, COLORS.muted);
    doc.text(options.subtitle, MARGIN, y);
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    rgb(doc, COLORS.gold);
    doc.text(hero.label.toUpperCase(), MARGIN + 22, y + 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    rgb(doc, COLORS.white);
    doc.text(hero.value, MARGIN + 22, y + 54);

    if (hero.hint) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      rgb(doc, [180, 190, 210]);
      doc.text(hero.hint, pageWidth - MARGIN - 16, y + 54, { align: "right" });
    }
    y += 94;
  }

  // —— INPUT SUMMARY CARDS ——
  if (options.inputs.length > 0) {
    ensureSpace(90);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    doc.text("SUMMARY", MARGIN, y);
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      doc.text(input.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      rgb(doc, COLORS.ink);
      doc.text(String(input.value), x + 12, y + 40, {
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    doc.text("KEY RESULTS", MARGIN, y);
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      doc.text(row.label.toUpperCase(), x + 12, y + 18, {
        maxWidth: cardW - 20,
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      rgb(doc, i === 0 ? COLORS.navy : COLORS.ink);
      doc.text(String(row.value), x + 12, y + 40, { maxWidth: cardW - 20 });
    });
    y += cardH + 10;

    // remaining results as compact rows
    if (breakdown.length > n) {
      breakdown.slice(n).forEach((row) => {
        ensureSpace(16);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        doc.text(row.label, MARGIN, y);
        doc.setFont("helvetica", "bold");
        rgb(doc, COLORS.ink);
        doc.text(String(row.value), pageWidth - MARGIN, y, { align: "right" });
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
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      rgb(doc, COLORS.ink);
      doc.text("BREAKDOWN", MARGIN, y);
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
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        rgb(doc, COLORS.muted);
        doc.text(slice.label, MARGIN + chartSize + 40, ly);
        doc.setFont("helvetica", "bold");
        rgb(doc, COLORS.ink);
        const pct = total > 0 ? ((slice.value / total) * 100).toFixed(1) : "0";
        doc.text(
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    doc.text("JOURNEY", MARGIN, y);
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      rgb(doc, COLORS.ink);
      const lines = doc.splitTextToSize(step, stepW - 8);
      doc.text(lines, cx, y + 22, { align: "center" });
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    doc.text(
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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    rgb(doc, COLORS.ink);
    doc.text((options.table.title ?? "DETAILED SCHEDULE").toUpperCase(), MARGIN, y);
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
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      rgb(doc, COLORS.white);
      let x = MARGIN;
      cols.forEach((col, i) => {
        const align = i === 0 ? "left" : "right";
        const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
        doc.text(col.header, tx, y, { align });
        x += colWs[i];
      });
      y += 14;
    };

    groups.forEach((group) => {
      ensureSpace(36);
      if (group.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        rgb(doc, COLORS.navy);
        doc.text(group.title, MARGIN, y);
        y += 12;
      }
      drawTableHeader();

      group.rows.forEach((row, ri) => {
        ensureSpace(16);
        if (y > pageHeight - 50) {
          newPage();
          if (group.title) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            rgb(doc, COLORS.navy);
            doc.text(`${group.title} (continued)`, MARGIN, y);
            y += 12;
          }
          drawTableHeader();
        }
        if (ri % 2 === 1) {
          fill(doc, COLORS.rowAlt);
          doc.rect(MARGIN, y - 9, contentW, 13, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        rgb(doc, COLORS.ink);
        let x = MARGIN;
        cols.forEach((col, i) => {
          const cell = String(row[col.key] ?? "");
          const align = i === 0 ? "left" : "right";
          const tx = align === "left" ? x + 6 : x + colWs[i] - 6;
          doc.text(cell, tx, y, { align, maxWidth: colWs[i] - 10 });
          x += colWs[i];
        });
        y += 13;
      });
      y += 10;
    });

    if (options.table.rows.length > maxRows) {
      doc.setFontSize(8);
      rgb(doc, COLORS.muted);
      doc.text(
        `Showing first ${maxRows} of ${options.table.rows.length} rows.`,
        MARGIN,
        y
      );
      y += 12;
    }
  }

  // Disclaimer
  ensureSpace(40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  rgb(doc, COLORS.muted);
  const disclaimer = doc.splitTextToSize(
    "Illustrative estimate based on the inputs shown. Not investment, tax or legal advice. Rounding may create a small residual in the final instalment. © " +
      SITE_NAME,
    contentW
  );
  doc.text(disclaimer, MARGIN, y);

  drawFooter();

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    rgb(doc, COLORS.muted);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - MARGIN, pageHeight - 22, {
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
