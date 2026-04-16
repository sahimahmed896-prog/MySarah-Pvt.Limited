import type { LeadAttachment } from "@/types/lead";

export type ParsedApplicationSummary = {
  headline: string;
  fields: Record<string, string>;
  requiredDocuments: Array<{ label: string; value: string }>;
  notes: string;
};

export function isImageAttachment(fileName: string, url: string) {
  return /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)(\?.*)?$/i.test(fileName) || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url);
}

export function isPdfAttachment(fileName: string, url: string) {
  return /\.pdf(\?.*)?$/i.test(fileName) || /\.pdf(\?.*)?$/i.test(url);
}

export function getAttachmentPriority(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("passport")) return 0;
  if (normalized.includes("aadhaar") || normalized.includes("pan")) return 1;
  if (normalized.includes("bill") || normalized.includes("electricity")) return 2;
  if (normalized.includes("certificate") || normalized.includes("jamabandi") || normalized.includes("khajna") || normalized.includes("gaon bura")) return 3;
  if (normalized.includes("signature")) return 4;
  if (normalized.includes("photo")) return 5;
  return 6;
}

export function getAttachmentRatio(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("passport")) return "admin-document-media-portrait";
  if (normalized.includes("aadhaar") || normalized.includes("pan")) return "admin-document-media-id";
  if (normalized.includes("bill") || normalized.includes("electricity")) return "admin-document-media-wide";
  if (normalized.includes("signature")) return "admin-document-media-signature";
  if (normalized.includes("certificate") || normalized.includes("jamabandi") || normalized.includes("khajna") || normalized.includes("gaon bura")) {
    return "admin-document-media-certificate";
  }
  if (normalized.includes("photo")) return "admin-document-media-photo";
  return "admin-document-media-standard";
}

export function sortLeadAttachments(attachments: LeadAttachment[]) {
  return [...attachments].sort((left, right) => {
    const priorityDelta = getAttachmentPriority(left.label) - getAttachmentPriority(right.label);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return left.label.localeCompare(right.label);
  });
}

export function parseApplicationSummary(message: string): ParsedApplicationSummary {
  const lines = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const data: ParsedApplicationSummary = {
    headline: lines[0] || "Solar Digital Application",
    fields: {},
    requiredDocuments: [],
    notes: "",
  };

  let inDocuments = false;

  for (const line of lines.slice(1)) {
    if (line === "Required Documents:") {
      inDocuments = true;
      continue;
    }

    if (line.startsWith("Notes:")) {
      data.notes = line.slice("Notes:".length).trim();
      continue;
    }

    if (inDocuments) {
      const [label, ...rest] = line.split(":");
      if (label && rest.length > 0) {
        data.requiredDocuments.push({ label: label.trim(), value: rest.join(":").trim() });
      }
      continue;
    }

    const [label, ...rest] = line.split(":");
    if (label && rest.length > 0) {
      data.fields[label.trim()] = rest.join(":").trim();
    }
  }

  return data;
}

export function sanitizePdfFileName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "lead"}-document.pdf`;
}
