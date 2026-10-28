import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image scanlines
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.45;
  const cornerR = isMaskable ? 0 : width * 0.22;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // No filter for scanline

    for (let x = 0; x < width; x++) {
      // Determine color with nice gradient
      const t = (x + y) / (width + height);
      // Indigo (#4f46e5 = 79, 70, 229) to Amber (#f59e0b = 245, 158, 11)
      let r = Math.round(79 * (1 - t) + 245 * t);
      let g = Math.round(70 * (1 - t) + 158 * t);
      let b = Math.round(229 * (1 - t) + 11 * t);
      let a = 255;

      // Rounded rect check
      if (!isMaskable) {
        const dx = Math.abs(x - cx) - (width / 2 - cornerR);
        const dy = Math.abs(y - cy) - (height / 2 - cornerR);
        if (dx > 0 && dy > 0 && Math.sqrt(dx * dx + dy * dy) > cornerR) {
          a = 0;
        }
      }

      // Checkmark icon in center
      const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (distFromCenter < radius * 0.6) {
        // inner circle badge
        r = 255;
        g = 255;
        b = 255;
      }

      // Checkmark stroke check (approximate check mark)
      const nx = (x - cx) / (width * 0.25);
      const ny = (y - cy) / (height * 0.25);

      // Checkmark line 1: (-0.6, 0.1) to (-0.15, 0.55)
      // Checkmark line 2: (-0.15, 0.55) to (0.6, -0.4)
      const isCheck1 = nx >= -0.6 && nx <= -0.15 && Math.abs(ny - (nx * 1.0 + 0.7)) < 0.15;
      const isCheck2 = nx >= -0.15 && nx <= 0.65 && Math.abs(ny - (-nx * 1.25 + 0.35)) < 0.15;

      if ((isCheck1 || isCheck2) && distFromCenter < radius * 0.58) {
        r = 79;
        g = 70;
        b = 229;
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
// Write 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
// Write maskable 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
// Write apple-touch-icon.png
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

console.log('Successfully generated all PWA icons in /public!');
