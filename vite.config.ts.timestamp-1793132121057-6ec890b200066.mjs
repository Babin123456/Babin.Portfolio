var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/send-email.js
var send_email_exports = {};
__export(send_email_exports, {
  default: () => handler
});
import nodemailer from "file:///D:/Projects/Babin.Portfolio/node_modules/nodemailer/lib/nodemailer.js";
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : process.env.SMTP_SECURE === "true" ? 465 : 587;
  console.log("API called with method:", req.method);
  console.log("Environment variables:", {
    EMAIL_USER: emailUser ? "SET" : "NOT SET",
    EMAIL_PASS: emailPass ? "SET" : "NOT SET",
    SMTP_HOST: smtpHost || "using gmail service",
    SMTP_PORT: smtpPort
  });
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { email, message } = req.body;
  console.log("Request body:", { email, message });
  let senderName = null;
  let messageBody = (message || "").toString();
  const nameMatch = messageBody.match(/^Name:\s*(.+?)(?:\r?\n|$)/i);
  if (nameMatch) {
    senderName = nameMatch[1].trim();
    messageBody = messageBody.replace(/^Name:\s*.+?(?:\r?\n){1,2}/i, "");
  }
  if (!email || !messageBody) {
    return res.status(400).json({ error: "Email and message are required" });
  }
  if (!emailUser || !emailPass) {
    console.error("Missing email credentials. Set EMAIL_USER / SMTP_USER and EMAIL_PASS / SMTP_PASS in Vercel environment variables.");
    return res.status(500).json({
      error: "Email service is not configured. Please set EMAIL_USER (or SMTP_USER) and EMAIL_PASS (or SMTP_PASS) in Vercel Environment Variables.",
      code: "MISSING_CREDENTIALS"
    });
  }
  try {
    console.log("Creating transporter...");
    const transporterConfig = smtpHost ? {
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    } : {
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    };
    const transporter = nodemailer.createTransport(transporterConfig);
    console.log("Verifying transporter...");
    await transporter.verify();
    const baseUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3e3}`);
    const now = /* @__PURE__ */ new Date();
    const istTime = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istTimeFull = now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata" });
    const mailOptions = {
      from: `"Babin Bid Portfolio" <${emailUser}>`,
      to: process.env.RECIPIENT_EMAIL || emailUser,
      subject: `Portfolio Contact ~ ${senderName || "New Message"} (${email})`,
      html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Portfolio Contact</title>
                    <style>
                        :root {
                            color-scheme: light dark;
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 36px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
                    
                    <!-- Outer Envelope Postcard with Custom Blue & Cyan Striped Border -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background: repeating-linear-gradient(135deg, #2563eb 0px, #2563eb 16px, #ffffff 16px, #ffffff 26px, #06b6d4 26px, #06b6d4 42px, #ffffff 42px, #ffffff 52px); border-radius: 16px; padding: 10px; box-shadow: 0 20px 45px -10px rgba(37, 99, 235, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08);">
                        <tr>
                            <td>
                                <!-- Inner Parchment Card -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fdfbf7; border-radius: 10px; border: 1px solid #e7e3d8; overflow: hidden;">
                                    
                                    <!-- Top Postal Header -->
                                    <tr>
                                        <td style="padding: 26px 28px 18px 28px;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <!-- Left: Dispatch Title Header -->
                                                    <td valign="middle" align="left" style="width: 65%;">
                                                        <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 900; color: #1e293b; letter-spacing: -0.02em; line-height: 1.15;">
                                                            <a href="https://babinbid.xyz" target="_blank" style="color: #1e293b; text-decoration: none;">PORTFOLIO DISPATCH</a>
                                                        </div>
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #0891b2; margin-top: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
                                                            INCOMING TRANSMISSION &middot; <a href="https://babinbid.xyz" target="_blank" style="color: #0891b2; text-decoration: underline; font-weight: 800;">BABINBID.XYZ</a>
                                                        </div>
                                                    </td>

                                                    <!-- Right: Postage Stamp (BB Logo Only) -->
                                                    <td valign="middle" align="right" style="width: 35%;">
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display: inline-table; vertical-align: middle;">
                                                            <tr>
                                                                <!-- Authentic HTML/CSS Perforated Postage Stamp (BB Logo Only) -->
                                                                <td valign="middle">
                                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 66px; height: 66px; background-color: #ecfeff; border: 2px dashed #0891b2; border-radius: 6px; box-shadow: 1px 2px 5px rgba(0,0,0,0.08);">
                                                                        <tr>
                                                                            <td align="center" valign="middle" style="padding: 5px;">
                                                                                <table role="presentation" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdff; border: 1px solid #a5f3fc; border-radius: 4px;">
                                                                                    <tr>
                                                                                        <td align="center" valign="middle" style="padding: 8px 0;">
                                                                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                                                                                                <tr>
                                                                                                    <td align="center" valign="middle" style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: #ffffff; font-family: Georgia, serif; font-size: 16px; font-weight: 900; line-height: 38px; text-align: center; box-shadow: 0 2px 6px rgba(6, 182, 212, 0.35); letter-spacing: -0.5px;">
                                                                                                        BB
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Perforated Postcard Divider -->
                                    <tr>
                                        <td style="padding: 0 28px;">
                                            <div style="border-top: 2px dashed #d1cbb8; height: 1px; font-size: 1px; line-height: 1px;">&nbsp;</div>
                                        </td>
                                    </tr>

                                    <!-- Address & Metadata Section (Vintage Typewriter Style) -->
                                    <tr>
                                        <td style="padding: 20px 28px 12px 28px;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <!-- Sender Details with Underlined Postcard Lines -->
                                                    <td valign="top" style="width: 58%; padding-right: 18px;">
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; color: #0891b2; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">
                                                            &gt;&gt; DISPATCH FROM:
                                                        </div>
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: 800; color: #0f172a; padding-bottom: 4px; border-bottom: 1.5px solid #d1cbb8; margin-bottom: 8px;">
                                                            ${senderName || "Anonymous Visitor"}
                                                        </div>
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #2563eb; padding-bottom: 4px; border-bottom: 1.5px solid #d1cbb8; margin-bottom: 8px;">
                                                            <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                                                        </div>
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #475569; padding-bottom: 4px; border-bottom: 1.5px solid #d1cbb8;">
                                                            Location: Online Portfolio Inbound
                                                        </div>
                                                    </td>

                                                    <!-- Postal Seal & Timestamp Card -->
                                                    <td valign="top" style="width: 42%; border-left: 1.5px solid #e7e3d8; padding-left: 18px;">
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; color: #2563eb; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">
                                                            &gt;&gt; POSTAL LOG:
                                                        </div>
                                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.5; color: #334155;">
                                                            <strong>RECEIVED:</strong><br>${istTimeFull}<br>
                                                            <strong>ORIGIN:</strong> <a href="https://babinbid.xyz" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 700;">babinbid.xyz</a><br>
                                                            <strong>ROUTING:</strong> DIRECT DISPATCH
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Letter Body / Message Content -->
                                    <tr>
                                        <td style="padding: 14px 28px 24px 28px;">
                                            <div style="background-color: #ffffff; border: 1.5px solid #d8d3c3; border-radius: 8px; padding: 20px 22px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.03);">
                                                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 900; color: #0891b2; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px dotted #cbd5e1; padding-bottom: 6px;">
                                                    <span style="display: inline-block; vertical-align: middle; width: 13px; height: 9px; border: 1.5px solid #0891b2; border-radius: 2px; line-height: 0; font-size: 0; margin-right: 6px; margin-top: -2px; box-sizing: border-box;"><span style="display: block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 4px solid #0891b2; margin: 0 auto;"></span></span>MESSAGE MEMORANDUM
                                                </div>
                                                <div style="font-family: 'Courier New', Courier, monospace; font-size: 15px; line-height: 1.7; color: #1e293b; font-weight: 600; white-space: pre-wrap; word-break: break-word;">${messageBody}</div>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Quick Reply Action Button -->
                                    <tr>
                                        <td align="center" style="padding: 0 28px 26px 28px;">
                                            <a href="mailto:${email}?subject=Re:%20Portfolio%20Contact%20-%20Babin%20Bid" style="display: inline-block; padding: 13px 32px; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: #ffffff; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 900; text-decoration: none; border-radius: 8px; border: 1.5px solid #1e40af; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); text-transform: uppercase; letter-spacing: 0.08em;">
                                                <span style="display: inline-block; vertical-align: middle; width: 14px; height: 10px; border: 1.5px solid #ffffff; border-radius: 2px; line-height: 0; font-size: 0; margin-right: 8px; margin-top: -2px; box-sizing: border-box;"><span style="display: block; width: 0; height: 0; border-left: 5.5px solid transparent; border-right: 5.5px solid transparent; border-top: 4.5px solid #ffffff; margin: 0 auto;"></span></span>REPLY TO ${senderName ? senderName.split(" ")[0].toUpperCase() : "SENDER"} &rarr;
                                            </a>
                                        </td>
                                    </tr>

                                    <!-- Vintage Postal Footer -->
                                    <tr>
                                        <td style="padding: 16px 24px; background-color: #f4efe4; border-top: 1px solid #e7e3d8; text-align: center;">
                                            <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.04em;">
                                                OFFICIAL DISPATCH &middot; BABIN BID PORTFOLIO &middot; <a href="https://babinbid.xyz" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 700;">babinbid.xyz</a>
                                            </p>
                                            <p style="margin: 3px 0 0 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #78716c;">
                                                Belur, Howrah, West Bengal, India &middot; &copy; ${(/* @__PURE__ */ new Date()).getFullYear()}
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `,
      text: `
BABIN BID \xB7 PORTFOLIO CONTACT
===========================================
From: ${senderName || "Anonymous"} (${email})
Date: ${istTimeFull}

MESSAGE:
-------------------------------------------
${messageBody}

-------------------------------------------
Reply to: ${email}
Sent via portfolio contact form at babinbid.xyz
            `,
      replyTo: email
    };
    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    let errorMessage = "Failed to send email";
    if (error.code === "EAUTH") {
      errorMessage = "Authentication failed. Please check your email credentials.";
    } else if (error.code === "ECONNREFUSED") {
      errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.responseCode === 535) {
      errorMessage = "Email authentication failed. Please check your Gmail app password.";
    }
    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    });
  }
}
var init_send_email = __esm({
  "api/send-email.js"() {
    "use strict";
  }
});

// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Projects/Babin.Portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/Babin.Portfolio/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "file:///D:/Projects/Babin.Portfolio/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/Projects/Babin.Portfolio/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
function localApiPlugin() {
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
            const apiReq = req;
            try {
              apiReq.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              apiReq.body = {};
            }
            const enhancedRes = res;
            if (!enhancedRes.status) {
              enhancedRes.status = function(code) {
                this.statusCode = code;
                return this;
              };
            }
            if (!enhancedRes.json) {
              enhancedRes.json = function(data) {
                this.setHeader("Content-Type", "application/json");
                this.end(JSON.stringify(data));
                return this;
              };
            }
            try {
              const { default: handler2 } = await Promise.resolve().then(() => (init_send_email(), send_email_exports));
              await handler2(apiReq, enhancedRes);
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
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.EMAIL_USER = env.EMAIL_USER || process.env.EMAIL_USER;
  process.env.EMAIL_PASS = env.EMAIL_PASS || process.env.EMAIL_PASS;
  return {
    base: process.env.GITHUB_ACTIONS ? "/Babin.Portfolio/" : "/",
    server: {
      host: "::",
      port: 8080
    },
    plugins: [
      react(),
      localApiPlugin(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    build: {
      chunkSizeWarningLimit: 1e3,
      sourcemap: false
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBpL3NlbmQtZW1haWwuanMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxCYWJpbi5Qb3J0Zm9saW9cXFxcYXBpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxCYWJpbi5Qb3J0Zm9saW9cXFxcYXBpXFxcXHNlbmQtZW1haWwuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL0JhYmluLlBvcnRmb2xpby9hcGkvc2VuZC1lbWFpbC5qc1wiO2ltcG9ydCBub2RlbWFpbGVyIGZyb20gXCJub2RlbWFpbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XHJcbiAgICAvLyBTZXQgQ09SUyBoZWFkZXJzXHJcbiAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xyXG4gICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdQT1NULCBPUFRJT05TJyk7XHJcbiAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZScpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBwcmVmbGlnaHQgcmVxdWVzdHNcclxuICAgIGlmIChyZXEubWV0aG9kID09PSAnT1BUSU9OUycpIHtcclxuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVtYWlsVXNlciA9IHByb2Nlc3MuZW52LkVNQUlMX1VTRVIgfHwgcHJvY2Vzcy5lbnYuU01UUF9VU0VSO1xyXG4gICAgY29uc3QgZW1haWxQYXNzID0gcHJvY2Vzcy5lbnYuRU1BSUxfUEFTUyB8fCBwcm9jZXNzLmVudi5TTVRQX1BBU1MgfHwgcHJvY2Vzcy5lbnYuU01UUF9QQVNTV09SRDtcclxuICAgIGNvbnN0IHNtdHBIb3N0ID0gcHJvY2Vzcy5lbnYuU01UUF9IT1NUO1xyXG4gICAgY29uc3Qgc210cFBvcnQgPSBwcm9jZXNzLmVudi5TTVRQX1BPUlQgPyBwYXJzZUludChwcm9jZXNzLmVudi5TTVRQX1BPUlQsIDEwKSA6IChwcm9jZXNzLmVudi5TTVRQX1NFQ1VSRSA9PT0gXCJ0cnVlXCIgPyA0NjUgOiA1ODcpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiQVBJIGNhbGxlZCB3aXRoIG1ldGhvZDpcIiwgcmVxLm1ldGhvZCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIkVudmlyb25tZW50IHZhcmlhYmxlczpcIiwge1xyXG4gICAgICAgIEVNQUlMX1VTRVI6IGVtYWlsVXNlciA/IFwiU0VUXCIgOiBcIk5PVCBTRVRcIixcclxuICAgICAgICBFTUFJTF9QQVNTOiBlbWFpbFBhc3MgPyBcIlNFVFwiIDogXCJOT1QgU0VUXCIsXHJcbiAgICAgICAgU01UUF9IT1NUOiBzbXRwSG9zdCB8fCBcInVzaW5nIGdtYWlsIHNlcnZpY2VcIixcclxuICAgICAgICBTTVRQX1BPUlQ6IHNtdHBQb3J0XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVxLm1ldGhvZCAhPT0gXCJQT1NUXCIpIHtcclxuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogXCJNZXRob2QgTm90IEFsbG93ZWRcIiB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGVtYWlsLCBtZXNzYWdlIH0gPSByZXEuYm9keTtcclxuICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBib2R5OlwiLCB7IGVtYWlsLCBtZXNzYWdlIH0pO1xyXG5cclxuICAgIC8vIEV4dHJhY3Qgb3B0aW9uYWwgc2VuZGVyIG5hbWUgd2hlbiB0aGUgZnJvbnQtZW5kIGluY2x1ZGVzIGl0IGFzIFwiTmFtZTogPG5hbWU+XCIgYXQgdGhlIHRvcCBvZiB0aGUgbWVzc2FnZVxyXG4gICAgbGV0IHNlbmRlck5hbWUgPSBudWxsO1xyXG4gICAgbGV0IG1lc3NhZ2VCb2R5ID0gKG1lc3NhZ2UgfHwgJycpLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBuYW1lTWF0Y2ggPSBtZXNzYWdlQm9keS5tYXRjaCgvXk5hbWU6XFxzKiguKz8pKD86XFxyP1xcbnwkKS9pKTtcclxuICAgIGlmIChuYW1lTWF0Y2gpIHtcclxuICAgICAgICBzZW5kZXJOYW1lID0gbmFtZU1hdGNoWzFdLnRyaW0oKTtcclxuICAgICAgICAvLyBSZW1vdmUgdGhlIE5hbWUgbGluZSBhbmQgYW55IGZvbGxvd2luZyBlbXB0eSBsaW5lIHNvIHRoZSBtZXNzYWdlIGJvZHkgaXMgY2xlYW5cclxuICAgICAgICBtZXNzYWdlQm9keSA9IG1lc3NhZ2VCb2R5LnJlcGxhY2UoL15OYW1lOlxccyouKz8oPzpcXHI/XFxuKXsxLDJ9L2ksICcnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWVtYWlsIHx8ICFtZXNzYWdlQm9keSkge1xyXG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIkVtYWlsIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZFwiIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghZW1haWxVc2VyIHx8ICFlbWFpbFBhc3MpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBlbWFpbCBjcmVkZW50aWFscy4gU2V0IEVNQUlMX1VTRVIgLyBTTVRQX1VTRVIgYW5kIEVNQUlMX1BBU1MgLyBTTVRQX1BBU1MgaW4gVmVyY2VsIGVudmlyb25tZW50IHZhcmlhYmxlcy5cIik7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcclxuICAgICAgICAgICAgZXJyb3I6IFwiRW1haWwgc2VydmljZSBpcyBub3QgY29uZmlndXJlZC4gUGxlYXNlIHNldCBFTUFJTF9VU0VSIChvciBTTVRQX1VTRVIpIGFuZCBFTUFJTF9QQVNTIChvciBTTVRQX1BBU1MpIGluIFZlcmNlbCBFbnZpcm9ubWVudCBWYXJpYWJsZXMuXCIsXHJcbiAgICAgICAgICAgIGNvZGU6IFwiTUlTU0lOR19DUkVERU5USUFMU1wiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRyYW5zcG9ydGVyLi4uXCIpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zcG9ydGVyQ29uZmlnID0gc210cEhvc3RcclxuICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICBob3N0OiBzbXRwSG9zdCxcclxuICAgICAgICAgICAgICAgIHBvcnQ6IHNtdHBQb3J0LFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBwcm9jZXNzLmVudi5TTVRQX1NFQ1VSRSA9PT0gXCJ0cnVlXCIgfHwgc210cFBvcnQgPT09IDQ2NSxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyOiBlbWFpbFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFzczogZW1haWxQYXNzXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGxzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0VW5hdXRob3JpemVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDoge1xyXG4gICAgICAgICAgICAgICAgc2VydmljZTogXCJnbWFpbFwiLFxyXG4gICAgICAgICAgICAgICAgYXV0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IGVtYWlsVXNlcixcclxuICAgICAgICAgICAgICAgICAgICBwYXNzOiBlbWFpbFBhc3NcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0bHM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQodHJhbnNwb3J0ZXJDb25maWcpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlZlcmlmeWluZyB0cmFuc3BvcnRlci4uLlwiKTtcclxuICAgICAgICBhd2FpdCB0cmFuc3BvcnRlci52ZXJpZnkoKTtcclxuXHJcbiAgICAgICAgLy8gQ29tcHV0ZSBhIGJhc2UgVVJMIGZvciBzdGF0aWMgYXNzZXRzIHNvIGVtYWlsIGNsaWVudHMgY2FuIGZldGNoIGltYWdlc1xyXG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5TSVRFX1VSTCB8fCAocHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTCA/IGBodHRwczovLyR7cHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTH1gIDogYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDB9YCk7XHJcblxyXG4gICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWUgaW4gSVNUXHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBpc3RUaW1lID0gbm93LnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHsgdGltZVpvbmU6ICdBc2lhL0tvbGthdGEnIH0pO1xyXG4gICAgICAgIGNvbnN0IGlzdFRpbWVGdWxsID0gbm93LnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHsgZGF0ZVN0eWxlOiAnZnVsbCcsIHRpbWVTdHlsZTogJ3Nob3J0JywgdGltZVpvbmU6ICdBc2lhL0tvbGthdGEnIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgZnJvbTogYFwiQmFiaW4gQmlkIFBvcnRmb2xpb1wiIDwke2VtYWlsVXNlcn0+YCxcclxuICAgICAgICAgICAgdG86IHByb2Nlc3MuZW52LlJFQ0lQSUVOVF9FTUFJTCB8fCBlbWFpbFVzZXIsXHJcbiAgICAgICAgICAgIHN1YmplY3Q6IGBQb3J0Zm9saW8gQ29udGFjdCB+ICR7c2VuZGVyTmFtZSB8fCAnTmV3IE1lc3NhZ2UnfSAoJHtlbWFpbH0pYCxcclxuICAgICAgICAgICAgaHRtbDogYFxyXG4gICAgICAgICAgICAgICAgPCFET0NUWVBFIGh0bWw+XHJcbiAgICAgICAgICAgICAgICA8aHRtbCBsYW5nPVwiZW5cIj5cclxuICAgICAgICAgICAgICAgIDxoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRpdGxlPlBvcnRmb2xpbyBDb250YWN0PC90aXRsZT5cclxuICAgICAgICAgICAgICAgICAgICA8c3R5bGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDpyb290IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yLXNjaGVtZTogbGlnaHQgZGFyaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3R5bGU+XHJcbiAgICAgICAgICAgICAgICA8L2hlYWQ+XHJcbiAgICAgICAgICAgICAgICA8Ym9keSBzdHlsZT1cIm1hcmdpbjogMDsgcGFkZGluZzogMzZweCAxNHB4OyBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7IC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gT3V0ZXIgRW52ZWxvcGUgUG9zdGNhcmQgd2l0aCBDdXN0b20gQmx1ZSAmIEN5YW4gU3RyaXBlZCBCb3JkZXIgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIHJvbGU9XCJwcmVzZW50YXRpb25cIiB3aWR0aD1cIjEwMCVcIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDYyMHB4OyBtYXJnaW46IDAgYXV0bzsgYmFja2dyb3VuZDogcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMyNTYzZWIgMHB4LCAjMjU2M2ViIDE2cHgsICNmZmZmZmYgMTZweCwgI2ZmZmZmZiAyNnB4LCAjMDZiNmQ0IDI2cHgsICMwNmI2ZDQgNDJweCwgI2ZmZmZmZiA0MnB4LCAjZmZmZmZmIDUycHgpOyBib3JkZXItcmFkaXVzOiAxNnB4OyBwYWRkaW5nOiAxMHB4OyBib3gtc2hhZG93OiAwIDIwcHggNDVweCAtMTBweCByZ2JhKDM3LCA5OSwgMjM1LCAwLjI1KSwgMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMDgpO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBJbm5lciBQYXJjaG1lbnQgQ2FyZCAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgcm9sZT1cInByZXNlbnRhdGlvblwiIHdpZHRoPVwiMTAwJVwiIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmZGZiZjc7IGJvcmRlci1yYWRpdXM6IDEwcHg7IGJvcmRlcjogMXB4IHNvbGlkICNlN2UzZDg7IG92ZXJmbG93OiBoaWRkZW47XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFRvcCBQb3N0YWwgSGVhZGVyIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiAyNnB4IDI4cHggMThweCAyOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHBhZGRpbmc9XCIwXCIgY2VsbHNwYWNpbmc9XCIwXCIgYm9yZGVyPVwiMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIExlZnQ6IERpc3BhdGNoIFRpdGxlIEhlYWRlciAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249XCJtaWRkbGVcIiBhbGlnbj1cImxlZnRcIiBzdHlsZT1cIndpZHRoOiA2NSU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiBHZW9yZ2lhLCAnVGltZXMgTmV3IFJvbWFuJywgc2VyaWY7IGZvbnQtc2l6ZTogMjZweDsgZm9udC13ZWlnaHQ6IDkwMDsgY29sb3I6ICMxZTI5M2I7IGxldHRlci1zcGFjaW5nOiAtMC4wMmVtOyBsaW5lLWhlaWdodDogMS4xNTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vYmFiaW5iaWQueHl6XCIgdGFyZ2V0PVwiX2JsYW5rXCIgc3R5bGU9XCJjb2xvcjogIzFlMjkzYjsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1wiPlBPUlRGT0xJTyBESVNQQVRDSDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMXB4OyBmb250LXdlaWdodDogNzAwOyBjb2xvcjogIzA4OTFiMjsgbWFyZ2luLXRvcDogNnB4OyBsZXR0ZXItc3BhY2luZzogMC4wNWVtOyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJTkNPTUlORyBUUkFOU01JU1NJT04gJm1pZGRvdDsgPGEgaHJlZj1cImh0dHBzOi8vYmFiaW5iaWQueHl6XCIgdGFyZ2V0PVwiX2JsYW5rXCIgc3R5bGU9XCJjb2xvcjogIzA4OTFiMjsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IGZvbnQtd2VpZ2h0OiA4MDA7XCI+QkFCSU5CSUQuWFlaPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFJpZ2h0OiBQb3N0YWdlIFN0YW1wIChCQiBMb2dvIE9ubHkpIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj1cIm1pZGRsZVwiIGFsaWduPVwicmlnaHRcIiBzdHlsZT1cIndpZHRoOiAzNSU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtdGFibGU7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gQXV0aGVudGljIEhUTUwvQ1NTIFBlcmZvcmF0ZWQgUG9zdGFnZSBTdGFtcCAoQkIgTG9nbyBPbmx5KSAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249XCJtaWRkbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgcm9sZT1cInByZXNlbnRhdGlvblwiIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiBzdHlsZT1cIndpZHRoOiA2NnB4OyBoZWlnaHQ6IDY2cHg7IGJhY2tncm91bmQtY29sb3I6ICNlY2ZlZmY7IGJvcmRlcjogMnB4IGRhc2hlZCAjMDg5MWIyOyBib3JkZXItcmFkaXVzOiA2cHg7IGJveC1zaGFkb3c6IDFweCAycHggNXB4IHJnYmEoMCwwLDAsMC4wOCk7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHZhbGlnbj1cIm1pZGRsZVwiIHN0eWxlPVwicGFkZGluZzogNXB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmMGZkZmY7IGJvcmRlcjogMXB4IHNvbGlkICNhNWYzZmM7IGJvcmRlci1yYWRpdXM6IDRweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgdmFsaWduPVwibWlkZGxlXCIgc3R5bGU9XCJwYWRkaW5nOiA4cHggMDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgcm9sZT1cInByZXNlbnRhdGlvblwiIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiBhbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiB2YWxpZ249XCJtaWRkbGVcIiBzdHlsZT1cIndpZHRoOiAzOHB4OyBoZWlnaHQ6IDM4cHg7IGJvcmRlci1yYWRpdXM6IDUwJTsgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzI1NjNlYiAwJSwgIzA2YjZkNCAxMDAlKTsgY29sb3I6ICNmZmZmZmY7IGZvbnQtZmFtaWx5OiBHZW9yZ2lhLCBzZXJpZjsgZm9udC1zaXplOiAxNnB4OyBmb250LXdlaWdodDogOTAwOyBsaW5lLWhlaWdodDogMzhweDsgdGV4dC1hbGlnbjogY2VudGVyOyBib3gtc2hhZG93OiAwIDJweCA2cHggcmdiYSg2LCAxODIsIDIxMiwgMC4zNSk7IGxldHRlci1zcGFjaW5nOiAtMC41cHg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQkJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFBlcmZvcmF0ZWQgUG9zdGNhcmQgRGl2aWRlciAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogMCAyOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJib3JkZXItdG9wOiAycHggZGFzaGVkICNkMWNiYjg7IGhlaWdodDogMXB4OyBmb250LXNpemU6IDFweDsgbGluZS1oZWlnaHQ6IDFweDtcIj4mbmJzcDs8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIEFkZHJlc3MgJiBNZXRhZGF0YSBTZWN0aW9uIChWaW50YWdlIFR5cGV3cml0ZXIgU3R5bGUpIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiAyMHB4IDI4cHggMTJweCAyOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHBhZGRpbmc9XCIwXCIgY2VsbHNwYWNpbmc9XCIwXCIgYm9yZGVyPVwiMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFNlbmRlciBEZXRhaWxzIHdpdGggVW5kZXJsaW5lZCBQb3N0Y2FyZCBMaW5lcyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249XCJ0b3BcIiBzdHlsZT1cIndpZHRoOiA1OCU7IHBhZGRpbmctcmlnaHQ6IDE4cHg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnQ291cmllciBOZXcnLCBDb3VyaWVyLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTFweDsgZm9udC13ZWlnaHQ6IDgwMDsgY29sb3I6ICMwODkxYjI7IGxldHRlci1zcGFjaW5nOiAwLjA4ZW07IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IG1hcmdpbi1ib3R0b206IDZweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJmd0OyZndDsgRElTUEFUQ0ggRlJPTTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxNnB4OyBmb250LXdlaWdodDogODAwOyBjb2xvcjogIzBmMTcyYTsgcGFkZGluZy1ib3R0b206IDRweDsgYm9yZGVyLWJvdHRvbTogMS41cHggc29saWQgI2QxY2JiODsgbWFyZ2luLWJvdHRvbTogOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlbmRlck5hbWUgfHwgJ0Fub255bW91cyBWaXNpdG9yJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogNzAwOyBjb2xvcjogIzI1NjNlYjsgcGFkZGluZy1ib3R0b206IDRweDsgYm9yZGVyLWJvdHRvbTogMS41cHggc29saWQgI2QxY2JiODsgbWFyZ2luLWJvdHRvbTogOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwibWFpbHRvOiR7ZW1haWx9XCIgc3R5bGU9XCJjb2xvcjogIzI1NjNlYjsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1wiPiR7ZW1haWx9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlOyBmb250LXNpemU6IDEycHg7IGNvbG9yOiAjNDc1NTY5OyBwYWRkaW5nLWJvdHRvbTogNHB4OyBib3JkZXItYm90dG9tOiAxLjVweCBzb2xpZCAjZDFjYmI4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2NhdGlvbjogT25saW5lIFBvcnRmb2xpbyBJbmJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gUG9zdGFsIFNlYWwgJiBUaW1lc3RhbXAgQ2FyZCAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249XCJ0b3BcIiBzdHlsZT1cIndpZHRoOiA0MiU7IGJvcmRlci1sZWZ0OiAxLjVweCBzb2xpZCAjZTdlM2Q4OyBwYWRkaW5nLWxlZnQ6IDE4cHg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnQ291cmllciBOZXcnLCBDb3VyaWVyLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTFweDsgZm9udC13ZWlnaHQ6IDgwMDsgY29sb3I6ICMyNTYzZWI7IGxldHRlci1zcGFjaW5nOiAwLjA4ZW07IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IG1hcmdpbi1ib3R0b206IDZweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJmd0OyZndDsgUE9TVEFMIExPRzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMXB4OyBsaW5lLWhlaWdodDogMS41OyBjb2xvcjogIzMzNDE1NTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5SRUNFSVZFRDo8L3N0cm9uZz48YnI+JHtpc3RUaW1lRnVsbH08YnI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+T1JJR0lOOjwvc3Ryb25nPiA8YSBocmVmPVwiaHR0cHM6Ly9iYWJpbmJpZC54eXpcIiB0YXJnZXQ9XCJfYmxhbmtcIiBzdHlsZT1cImNvbG9yOiAjMjU2M2ViOyB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgZm9udC13ZWlnaHQ6IDcwMDtcIj5iYWJpbmJpZC54eXo8L2E+PGJyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPlJPVVRJTkc6PC9zdHJvbmc+IERJUkVDVCBESVNQQVRDSFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gTGV0dGVyIEJvZHkgLyBNZXNzYWdlIENvbnRlbnQgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDE0cHggMjhweCAyNHB4IDI4cHg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7IGJvcmRlcjogMS41cHggc29saWQgI2Q4ZDNjMzsgYm9yZGVyLXJhZGl1czogOHB4OyBwYWRkaW5nOiAyMHB4IDIycHg7IGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMDMpO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMHB4OyBmb250LXdlaWdodDogOTAwOyBjb2xvcjogIzA4OTFiMjsgbGV0dGVyLXNwYWNpbmc6IDAuMTJlbTsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbWFyZ2luLWJvdHRvbTogMTBweDsgYm9yZGVyLWJvdHRvbTogMXB4IGRvdHRlZCAjY2JkNWUxOyBwYWRkaW5nLWJvdHRvbTogNnB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IHdpZHRoOiAxM3B4OyBoZWlnaHQ6IDlweDsgYm9yZGVyOiAxLjVweCBzb2xpZCAjMDg5MWIyOyBib3JkZXItcmFkaXVzOiAycHg7IGxpbmUtaGVpZ2h0OiAwOyBmb250LXNpemU6IDA7IG1hcmdpbi1yaWdodDogNnB4OyBtYXJnaW4tdG9wOiAtMnB4OyBib3gtc2l6aW5nOiBib3JkZXItYm94O1wiPjxzcGFuIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7IHdpZHRoOiAwOyBoZWlnaHQ6IDA7IGJvcmRlci1sZWZ0OiA1cHggc29saWQgdHJhbnNwYXJlbnQ7IGJvcmRlci1yaWdodDogNXB4IHNvbGlkIHRyYW5zcGFyZW50OyBib3JkZXItdG9wOiA0cHggc29saWQgIzA4OTFiMjsgbWFyZ2luOiAwIGF1dG87XCI+PC9zcGFuPjwvc3Bhbj5NRVNTQUdFIE1FTU9SQU5EVU1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlOyBmb250LXNpemU6IDE1cHg7IGxpbmUtaGVpZ2h0OiAxLjc7IGNvbG9yOiAjMWUyOTNiOyBmb250LXdlaWdodDogNjAwOyB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7IHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XCI+JHttZXNzYWdlQm9keX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFF1aWNrIFJlcGx5IEFjdGlvbiBCdXR0b24gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwicGFkZGluZzogMCAyOHB4IDI2cHggMjhweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwibWFpbHRvOiR7ZW1haWx9P3N1YmplY3Q9UmU6JTIwUG9ydGZvbGlvJTIwQ29udGFjdCUyMC0lMjBCYWJpbiUyMEJpZFwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiAxM3B4IDMycHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMyNTYzZWIgMCUsICMwNmI2ZDQgMTAwJSk7IGNvbG9yOiAjZmZmZmZmOyBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlOyBmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiA5MDA7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgYm9yZGVyLXJhZGl1czogOHB4OyBib3JkZXI6IDEuNXB4IHNvbGlkICMxZTQwYWY7IGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgzNywgOTksIDIzNSwgMC4zNSk7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IGxldHRlci1zcGFjaW5nOiAwLjA4ZW07XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyB3aWR0aDogMTRweDsgaGVpZ2h0OiAxMHB4OyBib3JkZXI6IDEuNXB4IHNvbGlkICNmZmZmZmY7IGJvcmRlci1yYWRpdXM6IDJweDsgbGluZS1oZWlnaHQ6IDA7IGZvbnQtc2l6ZTogMDsgbWFyZ2luLXJpZ2h0OiA4cHg7IG1hcmdpbi10b3A6IC0ycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7XCI+PHNwYW4gc3R5bGU9XCJkaXNwbGF5OiBibG9jazsgd2lkdGg6IDA7IGhlaWdodDogMDsgYm9yZGVyLWxlZnQ6IDUuNXB4IHNvbGlkIHRyYW5zcGFyZW50OyBib3JkZXItcmlnaHQ6IDUuNXB4IHNvbGlkIHRyYW5zcGFyZW50OyBib3JkZXItdG9wOiA0LjVweCBzb2xpZCAjZmZmZmZmOyBtYXJnaW46IDAgYXV0bztcIj48L3NwYW4+PC9zcGFuPlJFUExZIFRPICR7c2VuZGVyTmFtZSA/IHNlbmRlck5hbWUuc3BsaXQoJyAnKVswXS50b1VwcGVyQ2FzZSgpIDogJ1NFTkRFUid9ICZyYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIFZpbnRhZ2UgUG9zdGFsIEZvb3RlciAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogMTZweCAyNHB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjRlZmU0OyBib3JkZXItdG9wOiAxcHggc29saWQgI2U3ZTNkODsgdGV4dC1hbGlnbjogY2VudGVyO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOiAwOyBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlOyBmb250LXNpemU6IDExcHg7IGZvbnQtd2VpZ2h0OiA3MDA7IGNvbG9yOiAjNDc1NTY5OyBsZXR0ZXItc3BhY2luZzogMC4wNGVtO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPRkZJQ0lBTCBESVNQQVRDSCAmbWlkZG90OyBCQUJJTiBCSUQgUE9SVEZPTElPICZtaWRkb3Q7IDxhIGhyZWY9XCJodHRwczovL2JhYmluYmlkLnh5elwiIHRhcmdldD1cIl9ibGFua1wiIHN0eWxlPVwiY29sb3I6ICMyNTYzZWI7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBmb250LXdlaWdodDogNzAwO1wiPmJhYmluYmlkLnh5ejwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW46IDNweCAwIDAgMDsgZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMHB4OyBjb2xvcjogIzc4NzE2YztcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmVsdXIsIEhvd3JhaCwgV2VzdCBCZW5nYWwsIEluZGlhICZtaWRkb3Q7ICZjb3B5OyAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG5cclxuICAgICAgICAgICAgICAgIDwvYm9keT5cclxuICAgICAgICAgICAgICAgIDwvaHRtbD5cclxuICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgdGV4dDogYFxyXG5CQUJJTiBCSUQgXHUwMEI3IFBPUlRGT0xJTyBDT05UQUNUXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuRnJvbTogJHtzZW5kZXJOYW1lIHx8ICdBbm9ueW1vdXMnfSAoJHtlbWFpbH0pXHJcbkRhdGU6ICR7aXN0VGltZUZ1bGx9XHJcblxyXG5NRVNTQUdFOlxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiR7bWVzc2FnZUJvZHl9XHJcblxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblJlcGx5IHRvOiAke2VtYWlsfVxyXG5TZW50IHZpYSBwb3J0Zm9saW8gY29udGFjdCBmb3JtIGF0IGJhYmluYmlkLnh5elxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICByZXBseVRvOiBlbWFpbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBlbWFpbC4uLlwiKTtcclxuICAgICAgICBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbChtYWlsT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgc2VudCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFbWFpbCBzZW5kaW5nIGVycm9yOlwiLCBlcnJvcik7XHJcblxyXG4gICAgICAgIC8vIFByb3ZpZGUgbW9yZSBzcGVjaWZpYyBlcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBcIkZhaWxlZCB0byBzZW5kIGVtYWlsXCI7XHJcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdFQVVUSCcpIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQuIFBsZWFzZSBjaGVjayB5b3VyIGVtYWlsIGNyZWRlbnRpYWxzLlwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCJDb3VsZCBub3QgY29ubmVjdCB0byBlbWFpbCBzZXJ2ZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXNwb25zZUNvZGUgPT09IDUzNSkge1xyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBcIkVtYWlsIGF1dGhlbnRpY2F0aW9uIGZhaWxlZC4gUGxlYXNlIGNoZWNrIHlvdXIgR21haWwgYXBwIHBhc3N3b3JkLlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xyXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxyXG4gICAgICAgICAgICBkZXRhaWxzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiID8gZXJyb3IubWVzc2FnZSA6IFwiSW50ZXJuYWwgc2VydmVyIGVycm9yXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcQmFiaW4uUG9ydGZvbGlvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxCYWJpbi5Qb3J0Zm9saW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL0JhYmluLlBvcnRmb2xpby92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiwgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB0eXBlIHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gXCJub2RlOmh0dHBcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuaW50ZXJmYWNlIEFwaVJlcXVlc3QgZXh0ZW5kcyBJbmNvbWluZ01lc3NhZ2Uge1xuICBib2R5PzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG59XG5cbmludGVyZmFjZSBBcGlSZXNwb25zZSBleHRlbmRzIFNlcnZlclJlc3BvbnNlIHtcbiAgc3RhdHVzPzogKGNvZGU6IG51bWJlcikgPT4gQXBpUmVzcG9uc2U7XG4gIGpzb24/OiAoZGF0YTogdW5rbm93bikgPT4gQXBpUmVzcG9uc2U7XG59XG5cbmZ1bmN0aW9uIGxvY2FsQXBpUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJsb2NhbC1hcGktaGFuZGxlclwiLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHJlcS51cmw/LnNwbGl0KFwiP1wiKVswXTtcbiAgICAgICAgaWYgKHVybCA9PT0gXCIvYXBpL3NlbmQtZW1haWxcIikge1xuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSBcIk9QVElPTlNcIikge1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCBcIipcIik7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiLCBcIlBPU1QsIE9QVElPTlNcIik7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLCBcIkNvbnRlbnQtVHlwZVwiKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCByYXdCb2R5ID0gXCJcIjtcbiAgICAgICAgICByZXEub24oXCJkYXRhXCIsIChjaHVuaykgPT4ge1xuICAgICAgICAgICAgcmF3Qm9keSArPSBjaHVuaztcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlcS5vbihcImVuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhcGlSZXEgPSByZXEgYXMgQXBpUmVxdWVzdDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGFwaVJlcS5ib2R5ID0gcmF3Qm9keSA/IChKU09OLnBhcnNlKHJhd0JvZHkpIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA6IHt9O1xuICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgIGFwaVJlcS5ib2R5ID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVuaGFuY2VkUmVzID0gcmVzIGFzIEFwaVJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKCFlbmhhbmNlZFJlcy5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgZW5oYW5jZWRSZXMuc3RhdHVzID0gZnVuY3Rpb24gKGNvZGU6IG51bWJlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzQ29kZSA9IGNvZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWVuaGFuY2VkUmVzLmpzb24pIHtcbiAgICAgICAgICAgICAgZW5oYW5jZWRSZXMuanNvbiA9IGZ1bmN0aW9uIChkYXRhOiB1bmtub3duKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFJ1bnRpbWUgc2VydmVybGVzcyBmdW5jdGlvblxuICAgICAgICAgICAgICBjb25zdCB7IGRlZmF1bHQ6IGhhbmRsZXIgfSA9IGF3YWl0IGltcG9ydChcIi4vYXBpL3NlbmQtZW1haWwuanNcIik7XG4gICAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIoYXBpUmVxLCBlbmhhbmNlZFJlcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkxvY2FsIEFQSSBIYW5kbGVyIEVycm9yOlwiLCBlcnIpO1xuICAgICAgICAgICAgICBpZiAoIXJlcy5oZWFkZXJzU2VudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycik7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiLCBkZXRhaWxzOiBtZXNzYWdlIH0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpO1xuICBwcm9jZXNzLmVudi5FTUFJTF9VU0VSID0gZW52LkVNQUlMX1VTRVIgfHwgcHJvY2Vzcy5lbnYuRU1BSUxfVVNFUjtcbiAgcHJvY2Vzcy5lbnYuRU1BSUxfUEFTUyA9IGVudi5FTUFJTF9QQVNTIHx8IHByb2Nlc3MuZW52LkVNQUlMX1BBU1M7XG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBwcm9jZXNzLmVudi5HSVRIVUJfQUNUSU9OUyA/IFwiL0JhYmluLlBvcnRmb2xpby9cIiA6IFwiL1wiLFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCI6OlwiLFxuICAgICAgcG9ydDogODA4MCxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBsb2NhbEFwaVBsdWdpbigpLFxuICAgICAgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpLFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIH0sXG4gIH07XG59KTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFxUixPQUFPLGdCQUFnQjtBQUU1UyxlQUFPLFFBQStCLEtBQUssS0FBSztBQUU1QyxNQUFJLFVBQVUsK0JBQStCLEdBQUc7QUFDaEQsTUFBSSxVQUFVLGdDQUFnQyxlQUFlO0FBQzdELE1BQUksVUFBVSxnQ0FBZ0MsY0FBYztBQUc1RCxNQUFJLElBQUksV0FBVyxXQUFXO0FBQzFCLFdBQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxJQUFJO0FBQUEsRUFDL0I7QUFFQSxRQUFNLFlBQVksUUFBUSxJQUFJLGNBQWMsUUFBUSxJQUFJO0FBQ3hELFFBQU0sWUFBWSxRQUFRLElBQUksY0FBYyxRQUFRLElBQUksYUFBYSxRQUFRLElBQUk7QUFDakYsUUFBTSxXQUFXLFFBQVEsSUFBSTtBQUM3QixRQUFNLFdBQVcsUUFBUSxJQUFJLFlBQVksU0FBUyxRQUFRLElBQUksV0FBVyxFQUFFLElBQUssUUFBUSxJQUFJLGdCQUFnQixTQUFTLE1B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
