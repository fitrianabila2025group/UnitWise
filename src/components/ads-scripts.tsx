"use client";

import Script from "next/script";

interface Props {
  scriptSrcs: string[];
  inlineCode: string;
  provider: string;
}

export function AdsScripts({ scriptSrcs, inlineCode, provider }: Props) {
  if (!scriptSrcs.length && !inlineCode && !provider) return null;

  return (
    <>
      {scriptSrcs.map((src, i) => (
        <Script key={i} src={src} strategy="afterInteractive" />
      ))}
      {inlineCode && (
        <Script
          id="ads-custom-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: inlineCode }}
        />
      )}
    </>
  );
}
