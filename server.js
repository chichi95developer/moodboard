const http = require("http");
const fs = require("fs");
const path = require("path");

const initialPort = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, "public");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

const server = http.createServer((request, response) => {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const filePath = path.join(publicDirectory, path.normalize(requestedPath));

  if (!filePath.startsWith(publicDirectory)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "text/plain; charset=utf-8" });
    response.end(data);
  });
});

function startServer(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use; trying port ${port + 1}.`);
      startServer(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, () => {
    console.log(`Moodboard is running at http://localhost:${port}`);
  });
}

startServer(initialPort);
