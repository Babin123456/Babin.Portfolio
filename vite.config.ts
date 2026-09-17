import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ApiRequest extends IncomingMessage {
  body?: Record<string, unknown>;
}

interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse;
  json?: (data: unknown) => ApiResponse;
}

function localApiPlugin(): Plugin {
  return {
    name: "local-api-handler",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url === "/api/send-email") {
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.statusCode = 200;
            res.end();
            return;
          }

          let rawBody = "";
          req.on("data", (chunk) => {
            rawBody += chunk;
          });

          req.on("end", async () => {
            const apiReq = req as ApiRequest;
            try {
              apiReq.body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
            } catch {
              apiReq.body = {};
            }

            const enhancedRes = res as ApiResponse;
            if (!enhancedRes.status) {
              enhancedRes.status = function (code: number) {
                this.statusCode = code;
                return this;
              };
            }
            if (!enhancedRes.json) {
              enhancedRes.json = function (data: unknown) {
                this.setHeader("Content-Type", "application/json");
                this.end(JSON.stringify(data));
                return this;
              };
            }

            try {
              // @ts-expect-error - Runtime serverless function
              const { default: handler } = await import("./api/send-email.js");
              await handler(apiReq, enhancedRes);
            } catch (err) {
              console.error("Local API Handler Error:", err);
              if (!res.headersSent) {
                const message = err instanceof Error ? err.message : String(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal Server Error", details: message }));
              }
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.EMAIL_USER = env.EMAIL_USER || process.env.EMAIL_USER;
  process.env.EMAIL_PASS = env.EMAIL_PASS || process.env.EMAIL_PASS;

  return {
    base: process.env.GITHUB_ACTIONS ? "/Babin.Portfolio/" : "/",
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      localApiPlugin(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
    },
  };
});

