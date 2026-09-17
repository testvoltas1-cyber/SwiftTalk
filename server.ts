import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SignalingServer } from './server/signaling.js';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  const PORT = process.env.PORT || 3000;

  // Body parser for base64 image uploads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploaded media files directly
  app.use('/uploads', express.static(uploadsDir));

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // API: Photo / Media Upload for Live Chat & IRC
  app.post('/api/upload', (req, res) => {
    try {
      const { image, title } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Parse base64 Data URL or raw base64
      let buffer: Buffer;
      let ext = 'jpg';

      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mime = matches[1].toLowerCase();
        if (mime.includes('png')) ext = 'png';
        else if (mime.includes('gif')) ext = 'gif';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('svg')) ext = 'svg';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(image, 'base64');
      }

      const uniqueId = Math.random().toString(36).substring(2, 9);
      const filename = `pic_${Date.now()}_${uniqueId}.${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      // Build absolute URL for sharing in IRC & web chats
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const directUrl = `${protocol}://${host}/uploads/${filename}`;

      return res.json({
        success: true,
        url: directUrl,
        filename,
        size: buffer.length,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.error('Error uploading picture:', err);
      return res.status(500).json({ error: err.message || 'Failed to upload image' });
    }
  });

  // Attach WebSocket Server for signaling
  const wss = new WebSocketServer({ noServer: true });
  const signalingServer = new SignalingServer(wss);

  // API: Get all active shared links (no bans, visible to all users)
  app.get('/api/links', (req, res) => {
    res.json({ success: true, links: signalingServer.getLinks() });
  });

  // API: Share a link publicly without bans or embed restrictions
  app.post('/api/links', (req, res) => {
    const { url, title, senderName, avatarColor, channel } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const created = signalingServer.addLink(cleanUrl, title, senderName, avatarColor, channel);
    return res.json({ success: true, link: created });
  });

  // API: Safe Link Redirector / Un-bannable Gateway (e.g. /r/lnk_xyz)
  app.get('/r/:id', (req, res) => {
    const targetId = req.params.id;
    const allLinks = signalingServer.getLinks();
    const found = allLinks.find((l) => l.id === targetId || l.id === `lnk_${targetId}`);
    if (found && found.url) {
      return res.redirect(found.url);
    }
    return res.redirect('/');
  });

  const distPath = path.join(__dirname, 'dist');
  const distIndexHtml = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(distIndexHtml);

  if (hasDist) {
    // Serve static production build
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (
        req.url.startsWith('/ws') ||
        req.url.startsWith('/api') ||
        req.url.startsWith('/uploads') ||
        req.url.startsWith('/r/')
      ) {
        return next();
      }
      res.sendFile(distIndexHtml, (err) => {
        if (err) next(err);
      });
    });
  } else {
    // When dist/index.html does not exist (e.g. before build or in dev), use Vite middleware
    console.log('⚡ dist/index.html not found, mounting Vite middleware dynamically...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error('Failed to start Vite middleware mode:', err);
      const rootIndex = path.join(__dirname, 'index.html');
      if (fs.existsSync(rootIndex)) {
        app.get('*', (req, res) => res.sendFile(rootIndex));
      }
    }
  }

  httpServer.on('upgrade', (request, socket, head) => {
    const url = request.url || '';
    if (url === '/ws' || url.startsWith('/ws?')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Stranger Chat Server listening on port ${PORT}`);
  });
}

startServer();
