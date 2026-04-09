/*─────────────────────────────────────────
  lib/converter.js – ayanaMD by KennDev
─────────────────────────────────────────*/

import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { tmpdir } from 'os';

const tmp = tmpdir();

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    const tmpIn  = path.join(tmp, `${Date.now()}_in.${ext}`);
    const tmpOut = path.join(tmp, `${Date.now()}_out.${ext2}`);
    await fs.writeFile(tmpIn, buffer);
    const proc = spawn('ffmpeg', ['-y', '-i', tmpIn, ...args, tmpOut]);
    proc.on('error', reject);
    proc.on('close', async (code) => {
      await fs.unlink(tmpIn).catch(() => {});
      if (code !== 0) { await fs.unlink(tmpOut).catch(() => {}); return reject(new Error(`FFmpeg code ${code}`)); }
      const data = await fs.readFile(tmpOut);
      await fs.unlink(tmpOut).catch(() => {});
      resolve({ data, filename: tmpOut });
    });
  });
}

export async function toAudio(buffer, ext = 'mp4') {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'], ext, 'opus');
}

export async function toPTT(buffer, ext = 'mp4') {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on'], ext, 'ogg');
}

export async function toVideo(buffer, ext = 'mp4') {
  return ffmpeg(buffer, ['-c:v', 'libx264', '-c:a', 'aac'], ext, 'mp4');
}

export async function toMP3(buffer, ext = 'mp4') {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libmp3lame', '-q:a', '2'], ext, 'mp3');
}
