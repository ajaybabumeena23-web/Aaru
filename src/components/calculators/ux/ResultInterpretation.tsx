import { AlertBox } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export type ResultInterpretationProps = {
  /** Short headline, e.g. "What this means" */
  title?: string;
  /** Plain-language bullets derived from the live result */
  points: string[];
  /** Optional caveat under the bullets */
  footnote?: string;
  className?: string;
};

/**
 * Decision-support copy under calculator results.
 * Does not change math — only explains the current outputs.
 */
export function ResultInterpretation({
  title = "What this means",
  points,
  footnote = "Illustrative estimate based on your inputs — not a forecast or advice.",
  className,
}: ResultInterpretationProps) {
  if (points.length === 0) return null;

  return (
    <AlertBox title={title} variant="info" className={cn(className)}>
      <ul className="list-disc space-y-1.5 pl-4">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {footnote ? (
        <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>
      ) : null}
    </AlertBox>
  );
}
