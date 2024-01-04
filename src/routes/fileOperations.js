// src/routes/fileOperations.js
import { promises as fs } from 'fs';
import path from 'path';

const baseDirectory = './data';

const getFilePath = (fileName) => {
    // 確保文件名不包含不安全的路徑片段
    if (fileName.includes('..')) {
        throw new Error('Invalid file name');
    }
    return path.join(baseDirectory, fileName);
};

export const readFile = async (fileName, res) => {
    try {
        const filePath = getFilePath(fileName);
        const data = await fs.readFile(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
    } catch (error) {
        res.writeHead(404);
        res.end('File not found');
    }
};

export const writeFile = async (fileName, res, newContent) => {
    try {
        const filePath = getFilePath(fileName);
        await fs.writeFile(filePath, newContent, 'utf8');
        res.writeHead(200);
        res.end('File written successfully');
    } catch (error) {
        res.writeHead(500);
        res.end('Error writing file');
    }
};

export const deleteFile = async (fileName, res) => {
    try {
        const filePath = getFilePath(fileName);
        await fs.unlink(filePath);
        res.writeHead(200);
        res.end('File deleted successfully');
    } catch (error) {
        res.writeHead(500);
        res.end('Error deleting file');
    }
};

export const listFiles = async (res) => {
    try {
        const files = await fs.readdir(baseDirectory);

        if (files.length === 0) {
            // 資料夾為空時創建一個預設文件
            const defaultFileName = 'default.txt';
            await fs.writeFile(path.join(baseDirectory, defaultFileName), 'This is a default file.');
            files.push(defaultFileName);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(files));
    } catch (error) {
        res.writeHead(500);
        res.end('Error reading directory');
    }
};