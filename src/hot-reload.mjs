// hot-reload.mjs
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

let nodeProcess;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startServer() {
    // 如果有現有的進程，先終止它
    if (nodeProcess) {
        nodeProcess.on('exit', () => {
            // 進程終止後，啟動新的伺服器進程
            spawnServer();
        });
        nodeProcess.kill('SIGTERM');
    } else {
        // 直接啟動伺服器進程
        spawnServer();
    }
}

function spawnServer() {
    const serverPath = path.resolve(__dirname, '..', 'server.js');
    console.log(`Starting server from: ${serverPath}`); 

    nodeProcess = spawn('node', [serverPath], { stdio: 'inherit' });

    nodeProcess.on('exit', function (code, signal) {
        console.log(`Node process exited with code ${code} due to signal ${signal}`);
    });
}

export function startMon() {
    fs.watch('./', { recursive: true }, (eventType, filename) => {
        console.log(`${filename} changed, restarting server...`);
        startServer();
    });

    startServer(); // 第一次啟動伺服器
}
