import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.CLOUDINARY_NAME": JSON.stringify(env.CLOUDINARY_NAME),
      "process.env.BACKEND_BASEURL": JSON.stringify(env.BACKEND_BASEURL),
    },
    plugins: [react()],
  };
});
