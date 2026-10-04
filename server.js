const http = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;
const publicRoot = __dirname;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
    const requestedFile = pathname === '/' ? 'index.html' : pathname.slice(1);
    const safePath = normalize(requestedFile).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = join(publicRoot, safePath);
    const file = await readFile(filePath);

    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(file);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'EISDIR') {
      console.error(error);
    }

    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Page not found');
  }
});

server.listen(port, host, () => {
  console.log(`Atlas is ready at http://${host}:${port}`);
});
