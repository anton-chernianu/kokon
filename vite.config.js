import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    root: 'src',
    base: './',
    server: {
        port: 5173,
        strictPort: true,
    },
    build: {
        outDir: '../dist/frontend',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
