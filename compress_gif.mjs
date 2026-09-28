import sharp from 'sharp';
async function run() {
  await sharp('public/samba-vera/barco-fondo.gif', { animated: true }).resize(800).gif({ effort: 7 }).toFile('public/samba-vera/barco-fondo.tmp.gif');
  await sharp('public/samba-vera/fondo_loop.gif', { animated: true }).resize(800).gif({ effort: 7 }).toFile('public/samba-vera/fondo_loop.tmp.gif');
}
run();
