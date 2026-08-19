"use client";

import * as React from "react";
import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareResultButtons({ title }: { title: string }) {
  const [copied, setCopied] = React.useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsapp = () => {
    const text = encodeURIComponent(`${title}\n${getUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const twitter = () => {
    const text = encodeURIComponent(title);
    const url = encodeURIComponent(getUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const email = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Here is my calculation on Aaru Wealth:\n\n${getUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 flex w-full items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-auto">
        <Share2 className="h-3.5 w-3.5" />
        Share
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="min-h-10 flex-1 sm:min-h-9 sm:flex-none"
        onClick={copy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="min-h-10 flex-1 sm:min-h-9 sm:flex-none"
        onClick={whatsapp}
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="min-h-10 min-w-10 sm:min-h-9"
        onClick={twitter}
        aria-label="Share on X"
      >
        X
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="min-h-10 flex-1 sm:min-h-9 sm:flex-none"
        onClick={email}
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>
    </div>
  );
}
