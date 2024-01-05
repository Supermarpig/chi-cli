import http from 'http';
import { parse } from 'querystring';
import { readFile, writeFile, deleteFile, listFiles } from './src/routes/fileOperations.js';
import { promises as fs } from 'fs';

const hostname = '127.0.0.1';
const port = 8787;


function start() {
    


const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const pathname = url.pathname;
    const query = url.searchParams;

    // 提供靜態文件
    if (method === 'GET' && pathname === '/') {
        try {
            const content = await fs.readFile('./public/index.html', 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
    // 以下是API路徑
    else if (method === 'GET' && pathname === '/read') {
        const fileName = query.get('fileName'); // 獲取文件名
        readFile(fileName, res).catch(error => {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
    } else if (method === 'POST' && pathname === '/write') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { fileName, content } = parse(body);
            writeFile(fileName, res, content).catch(error => {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            });
        });
    } else if (method === 'DELETE' && pathname === '/delete') {
        const fileName = query.get('fileName'); // 獲取文件名
        deleteFile(fileName, res).catch(error => {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
    } else if (method === 'GET' && pathname === '/list-files') {
        listFiles(res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

}

start();

export { start };