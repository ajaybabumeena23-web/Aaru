import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Calculator not found</h1>
      <p className="text-muted-foreground">
        That route is not in the IndiaCalc catalog yet.
      </p>
      <Button asChild>
        <Link href="/">Back to all calculators</Link>
      </Button>
    </div>
  );
}
