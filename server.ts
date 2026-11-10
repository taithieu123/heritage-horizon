import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './backend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Parse command line arguments: npm run dev -- --port 3000 --host 0.0.0.0
  const portArgIndex = process.argv.indexOf('--port');
  const portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : null;
  // Cloud Run sets PORT=8080 for Nginx, so dev server must bind to 3000
  const envPort = process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : null;
  const PORT = Number(portArg || envPort || 3000);

  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount backend API routes under /api
  app.use('/api', apiRouter);

  // Serve static assets from src/assets/images and database scripts
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));
  app.use('/database', express.static(path.resolve(__dirname, 'database')));

  if (!isProduction) {
    // In development mode, mount Vite middleware with hmr disabled to avoid port collisions
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built dist directory
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n[Server] Heritage & Horizon Discovery is running!`);
    console.log(`  > Local:   http://localhost:${PORT}/`);
    console.log(`  > Network: http://0.0.0.0:${PORT}/\n`);
  });

  server.on('error', (err: any) => {
    console.error('[Server Listen Error]', err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Error]', err);
  process.exit(1);
});
