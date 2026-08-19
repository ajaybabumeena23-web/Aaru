"use client";

import { HIGH_RETURN_THRESHOLD_PCT, HIGH_RETURN_WARNING } from "@/lib/pdf/format";
import { cn } from "@/lib/utils";

/** Subtle web-UI caution when assumed return exceeds the optimistic threshold. */
export function HighReturnCaution({
  ratePct,
  className,
}: {
  ratePct: number;
  className?: string;
}) {
  if (!Number.isFinite(ratePct) || ratePct <= HIGH_RETURN_THRESHOLD_PCT) {
    return null;
  }

  return (
    <p
      role="note"
      className={cn(
        "rounded-md border border-amber-500/30 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950/90",
        className
      )}
      title={HIGH_RETURN_WARNING}
    >
      Assumed return {ratePct.toFixed(1)}% p.a. is above 15%. Sustained returns
      at this level are highly optimistic and can be very volatile over long
      periods — use as a stretch scenario, not a baseline.
    </p>
  );
}
