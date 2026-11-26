import{defineConfig} from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    }
  },
  resolve: { dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
});