import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { SITE_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="text-muted-foreground">
        The link may be outdated, or the calculator has moved. Search{" "}
        {SITE_NAME} or browse tools below.
      </p>
      <div className="w-full">
        <SiteSearch large />
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/calculators">Go to Calculators</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
