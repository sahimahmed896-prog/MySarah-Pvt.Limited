import nodemailer from "nodemailer";
import type { LeadInput } from "@/types/lead";
import { company } from "@/lib/constants";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.ALERT_EMAIL_FROM || user;

let cachedTransporter: nodemailer.Transporter | null = null;
let verifiedTransporter = false;

function getMissingMailerFields() {
  const missing: string[] = [];
  if (!host) {
    missing.push("SMTP_HOST");
  }
  if (!port) {
    missing.push("SMTP_PORT");
  }
  if (!user) {
    missing.push("SMTP_USER");
  }
  if (!pass) {
    missing.push("SMTP_PASS");
  }
  if (!from) {
    missing.push("ALERT_EMAIL_FROM or SMTP_USER");
  }
  return missing;
}

function getRecipients() {
  const configured = (process.env.ALERT_EMAIL_TO || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  return [company.email];
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!host || !port || !user || !pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 10000,
  });

  return cachedTransporter;
}

export async function sendLeadEmail(lead: LeadInput) {
  const missing = getMissingMailerFields();
  if (missing.length > 0) {
    throw new Error(`Email config missing: ${missing.join(", ")}`);
  }

  const to = getRecipients();

  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("Unable to initialize SMTP transporter.");
  }

  if (!verifiedTransporter) {
    await transporter.verify();
    verifiedTransporter = true;
  }

  const attachmentSummary = lead.attachments && lead.attachments.length > 0
    ? `\n\nUploaded Documents:\n${lead.attachments
        .map((attachment) => `${attachment.label}: ${attachment.url}`)
        .join("\n")}`
    : "";

  const htmlAttachmentList = lead.attachments && lead.attachments.length > 0
    ? `<h3 style="margin:14px 0 8px;">Uploaded Documents</h3><ul>${lead.attachments
        .map((attachment) => `<li><strong>${attachment.label}</strong>: <a href="${attachment.url}">${attachment.url}</a></li>`)
        .join("")}</ul>`
    : "";

  await transporter.sendMail({
    from: `Mysarah Website <${from}>`,
    to,
    subject: `New ${lead.type.toUpperCase()} lead from ${lead.name}`,
    text: `Name: ${lead.name}\nPhone: ${lead.phone}\nLocation: ${lead.location}\nType: ${lead.type}\nMessage: ${lead.message}${attachmentSummary}`,
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#103421;">
        <h2 style="margin:0 0 10px;">New ${lead.type.toUpperCase()} Lead</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${lead.name}</p>
        <p style="margin:0 0 8px;"><strong>Phone:</strong> ${lead.phone}</p>
        <p style="margin:0 0 8px;"><strong>Location:</strong> ${lead.location}</p>
        <p style="margin:0 0 8px;"><strong>Type:</strong> ${lead.type}</p>
        <p style="margin:0 0 8px;"><strong>Message:</strong></p>
        <p style="margin:0 0 8px;white-space:pre-wrap;">${lead.message}</p>
        ${htmlAttachmentList}
      </div>
    `,
  });
}
