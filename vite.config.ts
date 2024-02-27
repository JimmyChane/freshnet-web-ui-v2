import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      manifestFilename: "manifest.json",
      manifest: {
        name: "Freshnet Enterprise",
        short_name: "Freshnet",
        icons: [
          {
            src: "/icon/favicons-16.ico",
            sizes: "16x16",
            type: "image/x-icon",
          },
          {
            src: "/icon/favicons-32.ico",
            sizes: "32x32",
            type: "image/x-icon",
          },
          { src: "/icon/logos-129.png", sizes: "129x129", type: "image/png" },
          { src: "/icon/logos-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon/logos-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon/logos-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
        start_url: "/",
        scope: "./",
        display: "standalone",
        background_color: "#f0f0f0",
        theme_color: "#2f579d",
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
