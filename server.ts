import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Ensure public directory exists
  const publicDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // API Route: Check if server has suiyueruge.mp3
  app.get('/api/music-status', (_req, res) => {
    const mp3Path = path.resolve(publicDir, 'suiyueruge.mp3');
    const exists = fs.existsSync(mp3Path);
    let size = 0;
    if (exists) {
      try {
        size = fs.statSync(mp3Path).size;
      } catch {
        // ignore
      }
    }
    res.json({
      exists,
      url: exists ? '/suiyueruge.mp3' : null,
      size,
    });
  });

  // API Route: Upload and persist MP3 to server public directory
  app.post('/api/upload-music', express.raw({ type: '*/*', limit: '50mb' }), (req, res) => {
    try {
      const buffer = req.body as Buffer;
      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: '上传内容为空' });
      }

      // Save to public/suiyueruge.mp3
      const targetPath = path.resolve(publicDir, 'suiyueruge.mp3');
      fs.writeFileSync(targetPath, buffer);

      // If dist exists, also copy to dist
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.resolve(distDir, 'suiyueruge.mp3'), buffer);
      }

      console.log(`[Music Sync] Successfully saved suiyueruge.mp3 (${buffer.length} bytes) to server`);
      res.json({ success: true, url: '/suiyueruge.mp3', size: buffer.length });
    } catch (err: any) {
      console.error('[Music Sync] Error saving audio file:', err);
      res.status(500).json({ error: err.message || '保存失败' });
    }
  });

  // Static serving for public directory
  app.use(express.static(publicDir));

  if (!isProd) {
    // In dev: mount vite.middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In prod: serve dist
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
