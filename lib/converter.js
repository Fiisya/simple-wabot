const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const tmpDir = path.join(__dirname, '../tmp');
(async () => {
  await fs.mkdir(tmpDir, { recursive: true });
})();

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  const tmpFile = path.join(tmpDir, `${Date.now()}.${ext}`);
  const outFile = `${tmpFile}.${ext2}`;
  await fs.writeFile(tmpFile, buffer);

  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn('ffmpeg', ['-y', '-i', tmpFile, ...args, outFile]);
    ffmpegProcess.on('error', reject);
    ffmpegProcess.on('close', async (code) => {
      await fs.unlink(tmpFile).catch(() => {});
      if (code !== 0) return reject(new Error(`FFmpeg exited with code ${code}`));
      const data = await fs.readFile(outFile);
      resolve({ data, filename: outFile });
    });
  });
}

async function toPTT(buffer, ext) {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on'], ext, 'ogg');
}

async function toAudio(buffer, ext) {
  return ffmpeg(
    buffer,
    ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'],
    ext,
    'opus'
  );
}

module.exports = { toAudio, toPTT };