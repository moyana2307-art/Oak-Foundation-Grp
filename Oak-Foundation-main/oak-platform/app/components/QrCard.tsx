"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { exportSvgAsPng } from "@/lib/qrImage";

type QrCardProps = {
  value: string;
  size?: number;
  downloadLabel?: string;
  showPrint?: boolean;
};

/**
 * Renders a QR code and offers it for download as a PNG.
 * The QR is drawn to a canvas so it can be exported as image/png.
 */
export default function QrCard({
  value,
  size = 220,
  downloadLabel = "Download as PNG",
  showPrint = true,
}: QrCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const downloadPNG = () => {
    const svgEl = wrapRef.current?.querySelector("svg");
    if (!svgEl) return;
    exportSvgAsPng(svgEl, size, "oak-nametag-qr.png");
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={wrapRef} className="rounded-[18px] border border-[#E3E8EF] bg-white p-3 shadow-[0_10px_25px_-14px_rgba(28,53,93,0.3)]">
        <QRCodeSVG value={value} size={size} level="M" marginSize={1} />
      </div>
      <button
        type="button"
        onClick={downloadPNG}
        className="mt-4 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#1C355D] text-[14px] font-semibold text-white transition hover:bg-[#1F3A6B]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        {downloadLabel}
      </button>
      {showPrint && (
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-2 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[13px] border border-[#C9D2E0] bg-white text-[14px] font-semibold text-[#1C355D] transition hover:bg-[#F2F5F9]"
        >
          Save / Print
        </button>
      )}
    </div>
  );
}