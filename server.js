import http from 'http';
import { parse } from 'querystring';
import { readFile, writeFile, deleteFile, listFiles } from './src/routes/fileOperations.js';
import { promises as fs } from 'fs';

const hostname = '127.0.0.1';


function start(port) {
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
            })
        }
        else if (method === 'GET' && pathname.startsWith('/read/')) {
            const pathParts = pathname.split('/').filter(part => part.length);
            if (pathParts.length === 2) {
                const dataType = pathParts[1];
                const fileName = query.get('fileName'); // 獲取文件名
                const fileExtension = fileName.split('.').pop().toLowerCase(); // 獲取文件擴展名

                try {
                    const filePath = `./data/${fileName}`;
                    const fileContent = await fs.readFile(filePath, 'utf-8');

                    // 根據文件類型處理內容
                    switch (fileExtension) {
                        case 'json':
                            const jsonData = JSON.parse(fileContent);
                            if (jsonData[dataType]) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(jsonData[dataType]));
                            } else {
                                res.writeHead(404, { 'Content-Type': 'text/plain' });
                                res.end('Data type not found');
                            }
                            break;
                        case 'txt':
                        case 'csv':
                            // 對於 TXT 和 CSV 文件，直接返回文件內容
                            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end(fileContent);
                            break;
                        default:
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end('Unsupported file type');
                    }
                } catch (error) {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Invalid path');
            }
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

// start();

export { start };