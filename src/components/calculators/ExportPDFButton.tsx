"use client";

import * as React from "react";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PdfInputRow = { label: string; value: string };
export type PdfResultRow = { label: string; value: string };
export type PdfTableColumn = { header: string; key: string };
export type PdfTableRow = Record<string, string | number>;

export type ExportPDFButtonProps = {
  /** Report title (e.g. calculator H1). */
  title: string;
  /** Snapshot of user inputs. */
  inputs: PdfInputRow[];
  /** Snapshot of computed results. */
  results: PdfResultRow[];
  /** Optional amortization / schedule table. */
  table?: {
    columns: PdfTableColumn[];
    rows: PdfTableRow[];
    /** Cap rows to keep PDF size reasonable. */
    maxRows?: number;
  };
  /** Optional note under the title. */
  subtitle?: string;
  fileName?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * Client-side PDF export of inputs, results, and an optional table.
 * Chart capture can be added later via an HTML canvas / html2canvas hook.
 */
export function ExportPDFButton({
  title,
  inputs,
  results,
  table,
  subtitle,
  fileName,
  className,
  disabled,
}: ExportPDFButtonProps) {
  const [busy, setBusy] = React.useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 48;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(title, margin, y);
      y += 22;

      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(subtitle, margin, y);
        doc.setTextColor(0);
        y += 18;
      }

      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, margin, y);
      doc.setTextColor(0);
      y += 24;

      const section = (heading: string, rows: { label: string; value: string }[]) => {
        ensureSpace(40 + rows.length * 16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(heading, margin, y);
        y += 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        rows.forEach((row) => {
          ensureSpace(16);
          doc.text(row.label, margin, y);
          doc.text(String(row.value), pageWidth - margin, y, { align: "right" });
          y += 14;
        });
        y += 12;
      };

      section("Inputs", inputs);
      section("Results", results);

      if (table && table.rows.length > 0) {
        const maxRows = table.maxRows ?? 120;
        const rows = table.rows.slice(0, maxRows);
        const colCount = table.columns.length;
        const usable = pageWidth - margin * 2;
        const colW = usable / colCount;

        ensureSpace(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Schedule", margin, y);
        y += 18;

        doc.setFontSize(8);
        table.columns.forEach((col, i) => {
          doc.text(col.header, margin + i * colW, y);
        });
        y += 10;
        doc.setDrawColor(200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

        doc.setFont("helvetica", "normal");
        rows.forEach((row) => {
          ensureSpace(14);
          table.columns.forEach((col, i) => {
            const cell = String(row[col.key] ?? "");
            doc.text(cell, margin + i * colW, y, {
              maxWidth: colW - 4,
            });
          });
          y += 12;
        });

        if (table.rows.length > maxRows) {
          y += 8;
          doc.setFontSize(9);
          doc.setTextColor(120);
          doc.text(
            `Showing first ${maxRows} of ${table.rows.length} rows.`,
            margin,
            y
          );
          doc.setTextColor(0);
        }
      }

      const safeName =
        fileName ??
        `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`;
      doc.save(safeName);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || busy}
      onClick={handleExport}
      className={cn(className)}
    >
      <Download className="h-4 w-4" />
      {busy ? "Preparing PDF…" : "Export to PDF"}
    </Button>
  );
}
