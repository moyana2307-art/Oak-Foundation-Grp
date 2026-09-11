"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { exportSvgAsPng } from "@/lib/qrImage";

export default function QrDownloadButton({
  value,
  label = "Download QR Code",
  size = 220,
}: {
  value: string;
  label?: string;
  size?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const svgEl = wrapRef.current?.querySelector("svg");
    if (svgEl) exportSvgAsPng(svgEl, size, "oak-entry-pass-qr.png");
  };

  return (
    <>
      <div ref={wrapRef} className="hidden">
        <QRCodeSVG value={value} size={size} level="M" marginSize={1} />
      </div>
      <button
        type="button"
        onClick={download}
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#162E55] text-[14px] font-bold text-white transition hover:bg-[#1F3A6B]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        {label}
      </button>
    </>
  );
}