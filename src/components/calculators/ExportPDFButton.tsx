"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  generatePremiumPdf,
  type PdfInputRow,
  type PdfResultRow,
  type PdfTableColumn,
  type PdfTableRow,
} from "@/lib/pdf/premium-report";

export type { PdfInputRow, PdfResultRow, PdfTableColumn, PdfTableRow };

export type ExportPDFButtonProps = {
  /** Report title (e.g. calculator name). */
  title: string;
  /** Snapshot of user inputs. */
  inputs: PdfInputRow[];
  /** Snapshot of computed results. */
  results: PdfResultRow[];
  /** Optional amortization / schedule table. */
  table?: {
    columns: PdfTableColumn[];
    rows: PdfTableRow[];
    maxRows?: number;
    title?: string;
    groupByYear?: boolean;
    monthKey?: string;
  };
  /** Optional note under the title (legacy). */
  subtitle?: string;
  /** Premium supporting line under the title. */
  tagline?: string;
  /** Large hero metric card. */
  hero?: { label: string; value: string; hint?: string };
  /** Donut chart slices (numeric — not formatted strings). */
  chartSlices?: { label: string; value: number; color?: string }[];
  /** Line chart series (e.g. outstanding balance). */
  balanceSeries?: number[];
  balanceChartTitle?: string;
  /** Simple journey steps. */
  journey?: string[];
  fileName?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * Client-side premium PDF export for Aaru Wealth calculators.
 * Preserves provided values exactly — presentation only.
 */
export function ExportPDFButton({
  title,
  inputs,
  results,
  table,
  subtitle,
  tagline,
  hero,
  chartSlices,
  balanceSeries,
  balanceChartTitle,
  journey,
  fileName,
  className,
  disabled,
}: ExportPDFButtonProps) {
  const [busy, setBusy] = React.useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      generatePremiumPdf({
        title,
        inputs,
        results,
        table: table
          ? {
              ...table,
              groupByYear:
                table.groupByYear ??
                (Boolean(table.monthKey) ||
                  table.columns.some(
                    (c) => c.key === "month" || /month|mo/i.test(c.header)
                  )),
              title: table.title ?? "Detailed schedule",
            }
          : undefined,
        subtitle,
        tagline,
        hero,
        chartSlices,
        balanceSeries,
        balanceChartTitle,
        journey,
        fileName,
      });
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
