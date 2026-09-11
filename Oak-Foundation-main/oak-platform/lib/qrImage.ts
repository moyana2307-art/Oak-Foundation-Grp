function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function exportSvgAsPng(svgEl: SVGSVGElement, size: number, filename: string) {
  const canvas = document.createElement("canvas");
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
    ctx.drawImage(
      img,
      pad,
      pad,
      (svgEl.clientWidth || size) * scale,
      (svgEl.clientHeight || size) * scale
    );
    triggerDownload(canvas.toDataURL("image/png"), filename);
  };

  img.onerror = () => {
    triggerDownload(svgUrl, filename.replace(/\.png$/, ".svg"));
  };

  img.src = svgUrl;
}