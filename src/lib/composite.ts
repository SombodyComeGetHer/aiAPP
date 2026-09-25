/** Side-by-side duo frame for Kling MC (client-side, no new deps). */
export async function compositeDuoFrame(
  leftDataUrl: string,
  rightDataUrl: string,
  width = 720,
  height = 1280,
): Promise<string> {
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load photo"));
      img.src = src;
    });

  const [left, right] = await Promise.all([load(leftDataUrl), load(rightDataUrl)]);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, width, height);

  const half = width / 2;
  const drawCover = (img: HTMLImageElement, x: number, w: number) => {
    const scale = Math.max(w / img.width, height / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (w - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  drawCover(left, 0, half);
  drawCover(right, half, half);
  return canvas.toDataURL("image/jpeg", 0.92);
}
