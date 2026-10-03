import {defineConfig} from 'vite';
// Equivalent static output for environments that prohibit Node child processes.
// The native esbuild CLI performs TS/JSX transformation before Vite packages it.
export default defineConfig({root:'.sites-runtime/staging',publicDir:'../../public',resolve:{preserveSymlinks:true},esbuild:false,build:{outDir:'../../dist',emptyOutDir:true,minify:false,cssMinify:false}});
