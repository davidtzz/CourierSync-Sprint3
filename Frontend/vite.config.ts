import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    // Proxy opcional para desarrollo (alternativa a CORS)
    // Descomenta si prefieres usar proxy en lugar de CORS en el backend
    // proxy: {
    //   '/CourierSync/api': {
    //     target: 'http://localhost:8080', // URL de tu backend Spring
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',  
  },
  publicDir: 'public', 
}));
