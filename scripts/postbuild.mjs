import { copyFile, access } from 'node:fs/promises';

// Root-relative Vite assets also work when GitHub serves this fallback for unknown paths.
await copyFile('dist/index.html', 'dist/404.html');
await access('dist/404.html');
console.log('GitHub Pages 404 fallback ready.');
