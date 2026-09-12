"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Icon } from "@iconify/react/dist/offline";
import downloadIcon from "@iconify/icons-lucide/download";
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
        <Icon icon={downloadIcon} className="h-5 w-5" aria-hidden />
        {label}
      </button>
    </>
  );
}