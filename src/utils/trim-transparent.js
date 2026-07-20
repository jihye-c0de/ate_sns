export async function trimTransparentPadding(blob, options = {}) {
  const { alphaThreshold = 10, padding = 0.06 } = options;

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > alphaThreshold) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return blob;

  const padX = Math.round((maxX - minX) * padding);
  const padY = Math.round((maxY - minY) * padding);
  const cropX = Math.max(0, minX - padX);
  const cropY = Math.max(0, minY - padY);
  const cropWidth = Math.min(canvas.width, maxX + padX + 1) - cropX;
  const cropHeight = Math.min(canvas.height, maxY + padY + 1) - cropY;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropWidth;
  outCanvas.height = cropHeight;
  const outCtx = outCanvas.getContext('2d');
  outCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return new Promise((resolve) => {
    outCanvas.toBlob((result) => resolve(result || blob), 'image/png');
  });
}
