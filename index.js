/*─────────────────────────────────────────
  index.js – ayanaMD by KennDev
  Auto-restart wrapper
─────────────────────────────────────────*/

import { spawn }  from 'child_process';
import path       from 'path';
import fs         from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

let isRunning = false;

function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [path.join(__dirname, file), ...process.argv.slice(2)];
  const p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  p.on('message', (data) => {
    if (data === 'reset') {
      p.kill();
      isRunning = false;
      start(file);
    } else if (data === 'uptime') {
      p.send(process.uptime());
    }
  });

  p.on('exit', (code) => {
    isRunning = false;
    console.error(`[index] Exited with code: ${code}. Restarting…`);
    setTimeout(() => start('main.js'), 2_000);
  });

  p.on('error', (err) => {
    console.error(`[index] Error: ${err}`);
    p.kill();
    isRunning = false;
    setTimeout(() => start('main.js'), 2_000);
  });
}

start('main.js');
