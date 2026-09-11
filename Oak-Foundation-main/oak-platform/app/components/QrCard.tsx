"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

type QrCardProps = {
  value: string;
  size?: number;
};

/**
 * Renders a QR code and offers it for download as a PNG.
 * The QR is drawn to a canvas so it can be exported as image/png.
 */
export default function QrCard({ value, size = 220 }: QrCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadPNG = () => {
    const svgEl = wrapRef.current?.querySelector("svg");
    const canvas = canvasRef.current;
    if (!svgEl || !canvas) return;

    const xml = new XMLSerializer().serializeToString(svgEl);
    const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    const img = new Image();

    img.onload = () => {
      const pad = 16;
      const outSize = size + pad * 2;
      canvas.width = outSize;
      canvas.height = outSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outSize, outSize);
      const scale = size / Math.min(svgEl.clientWidth || size, size);
      ctx.drawImage(img, pad, pad, (svgEl.clientWidth || size) * scale, (svgEl.clientHeight || size) * scale);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "oak-nametag-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.onerror = () => {
      const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "oak-nametag-qr.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.src = svgUrl;
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={wrapRef} className="rounded-[18px] border border-[#E3E8EF] bg-white p-3 shadow-[0_10px_25px_-14px_rgba(28,53,93,0.3)]">
        <QRCodeSVG value={value} size={size} level="M" marginSize={1} />
      </div>
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      <button
        type="button"
        onClick={downloadPNG}
        className="mt-4 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#1C355D] text-[14px] font-semibold text-white transition hover:bg-[#1F3A6B]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        Download as PNG
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-2 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[13px] border border-[#C9D2E0] bg-white text-[14px] font-semibold text-[#1C355D] transition hover:bg-[#F2F5F9]"
      >
        Save / Print
      </button>
    </div>
  );
}
