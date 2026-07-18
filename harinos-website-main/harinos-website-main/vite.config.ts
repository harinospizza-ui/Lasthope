import path from 'path';
import { Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appRoot = path.resolve(__dirname, 'harinos-website-main/harinos-website-main');



const createNoCacheVersionPlugin = (buildVersion: string): Plugin => ({
  name: 'harinos-no-cache-version',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const requestPath = req.url?.split('?')[0] ?? '';

      if (
        requestPath === '/' ||
        requestPath.endsWith('.html') ||
        requestPath.endsWith('/manifest.json') ||
        requestPath.endsWith('/version.json') ||
        requestPath.endsWith('/sw.js')
      ) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }

      next();
    });
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify(
        {
          version: buildVersion,
          generatedAt: buildVersion,
        },
        null,
        2,
      ),
    });
  },
});



export default defineConfig(() => {
  const buildVersion = new Date().toISOString();

  return {
    root: appRoot,
    base: '/',
    publicDir: path.resolve(appRoot, 'public'),
    envDir: __dirname,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      createNoCacheVersionPlugin(buildVersion),
    ],

    build: {
      outDir: path.resolve(appRoot, 'dist'),
      emptyOutDir: true,
      target: ['es2018', 'safari13'],
      cssTarget: 'safari13',
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/firestore'],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(buildVersion),
    },
    resolve: {
      alias: {
        '@': appRoot,
      },
    },
  };
});
