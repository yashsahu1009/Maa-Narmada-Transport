import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const suppressMissingSourceMaps = {
  name: 'suppress-missing-sourcemaps',
  transform(code, id) {
    if (id.includes('html2pdf.js') || id.includes('es6-promise')) {
      return {
        code: code.replace(/\/\/#\s*sourceMappingURL=.*$/gm, ''),
        map: null
      };
    }
  }
};

export default defineConfig({
  plugins: [suppressMissingSourceMaps, react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['canvg']
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      external: (id) => id.includes('core-js')
    }
  }
});
