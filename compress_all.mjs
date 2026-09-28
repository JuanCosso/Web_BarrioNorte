import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      await processDir(filePath);
    } else if (stats.size > 500 * 1024) { // > 500KB
      const ext = filePath.toLowerCase();
      if (ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
        console.log(`Compressing ${filePath} (${(stats.size/1024/1024).toFixed(2)} MB)...`);
        const tempPath = filePath + '.tmp';
        try {
          await sharp(filePath)
            .resize(1000, null, { withoutEnlargement: true })
            .webp({ quality: 80 }) // wait, keep format same
            .toFile(tempPath);
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
        } catch (e) {
          try {
             // If webp fails because format is forced by extension, just use sharp native
             await sharp(filePath)
               .resize(1000, null, { withoutEnlargement: true })
               .toFile(tempPath);
             fs.unlinkSync(filePath);
             fs.renameSync(tempPath, filePath);
          } catch(e2) {
             console.log(`Failed ${filePath}:`, e2.message);
          }
        }
      }
    }
  }
}

processDir('public').then(() => console.log('Done!'));
