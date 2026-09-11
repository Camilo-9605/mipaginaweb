// server.mjs
import http from 'http';
import querystring from 'querystring';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreamos __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ARCHIVO = path.join(__dirname, 'mensajes.txt');

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/contact') {
    try {
      // Leemos el body
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const formData = querystring.parse(body);

      const fecha = new Date().toLocaleString('es-ES');
      const mensaje = `
----------------------------------------
Fecha: ${fecha}
Nombre: ${formData.nombre || 'Sin nombre'}
Email: ${formData.email || 'Sin email'}
Negocio: ${formData.negocio || 'Sin mensaje'}
----------------------------------------
`;

      // Guardamos el mensaje
      await fs.appendFile(ARCHIVO, mensaje, 'utf-8');

      console.log('Mensaje guardado correctamente:');
      console.log(mensaje);

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });

      res.end(`
        <h1>¡Mensaje recibido!</h1>
        <p>Gracias <strong>${formData.nombre || 'amigo'}</strong>, te contactaremos pronto.</p>
        <p><small>Tu mensaje fue guardado correctamente.</small></p>
        <a href="javascript:history.back()">Volver</a>
      `);

    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno del servidor');
    }

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Los mensajes se guardarán en: ${ARCHIVO}`);
});


