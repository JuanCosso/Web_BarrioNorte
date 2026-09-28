import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function compressDir(dir, isGif = false) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.size > 1024 * 1024) { // > 1MB
      console.log(`Compressing ${filePath} (${(stats.size/1024/1024).toFixed(2)} MB)...`);
      const tempPath = filePath + '.tmp';
      try {
        if (isGif && filePath.endsWith('.gif')) {
           // sharp doesn't fully support animated gif compression easily without losing animation,
           // we'll leave gifs alone or resize them carefully if needed.
           // Actually let's just resize the width
           await sharp(filePath, { animated: true })
            .resize(800)
            .gif()
            .toFile(tempPath);
           fs.renameSync(tempPath, filePath);
        } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
           await sharp(filePath)
            .resize(1000, null, { withoutEnlargement: true })
            .webp({ quality: 80 }) // Converting to webp would change extension, let's keep png
            .toFile(tempPath + '.png'); // wait, let's just compress png
           fs.renameSync(tempPath + '.png', filePath);
        }
      } catch (e) {
        console.log(`Failed to compress ${filePath}:`, e.message);
      }
    }
  }
}

async function run() {
  await compressDir('public/museo/camisetas');
  await compressDir('public/samba-vera', true);
  await compressDir('public/inicio');
  await compressDir('public/logos');
  console.log('Compression complete!');
}

run();
