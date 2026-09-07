// server.js
import http from "node:http";

// Servidor básico
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/contact") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      // Guardar datos en archivo
      fs.appendFile("contactos.txt", body + "\n", (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error al guardar datos");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ mensaje: "Datos guardados en contactos.txt" }));
        }
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Ruta no encontrada");
  }
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});


