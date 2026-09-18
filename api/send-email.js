import nodemailer from "nodemailer";

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log("API called with method:", req.method);
    console.log("Environment variables:", {
        EMAIL_USER: process.env.EMAIL_USER ? "SET" : "NOT SET",
        EMAIL_PASS: process.env.EMAIL_PASS ? "SET" : "NOT SET"
    });

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, message } = req.body;
    console.log("Request body:", { email, message });

    // Extract optional sender name when the front-end includes it as "Name: <name>" at the top of the message
    let senderName = null;
    let messageBody = (message || '').toString();
    const nameMatch = messageBody.match(/^Name:\s*(.+?)(?:\r?\n|$)/i);
    if (nameMatch) {
        senderName = nameMatch[1].trim();
        // Remove the Name line and any following empty line so the message body is clean
        messageBody = messageBody.replace(/^Name:\s*.+?(?:\r?\n){1,2}/i, '');
    }

    if (!email || !messageBody) {
        return res.status(400).json({ error: "Email and message are required" });
    }

    try {
        console.log("Creating transporter...");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Add additional Gmail-specific settings
            secure: true,
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log("Verifying transporter...");
        await transporter.verify();

        // Compute a base URL for static assets so email clients can fetch images
        const baseUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`);

        // Get current time in IST
        const now = new Date();
        const istTime = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        const istTimeFull = now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

        const mailOptions = {
            from: `"Babin Bid Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact ~ ${senderName || 'New Message'} (${email})`,
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
                                                            ${senderName || 'Anonymous Visitor'}
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
                                                <span style="display: inline-block; vertical-align: middle; width: 14px; height: 10px; border: 1.5px solid #ffffff; border-radius: 2px; line-height: 0; font-size: 0; margin-right: 8px; margin-top: -2px; box-sizing: border-box;"><span style="display: block; width: 0; height: 0; border-left: 5.5px solid transparent; border-right: 5.5px solid transparent; border-top: 4.5px solid #ffffff; margin: 0 auto;"></span></span>REPLY TO ${senderName ? senderName.split(' ')[0].toUpperCase() : 'SENDER'} &rarr;
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
                                                Belur, Howrah, West Bengal, India &middot; &copy; ${new Date().getFullYear()}
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
BABIN BID · PORTFOLIO CONTACT
===========================================
From: ${senderName || 'Anonymous'} (${email})
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

        // Provide more specific error messages
        let errorMessage = "Failed to send email";
        if (error.code === 'EAUTH') {
            errorMessage = "Authentication failed. Please check your email credentials.";
        } else if (error.code === 'ECONNREFUSED') {
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