import { z } from "zod";

const leadAttachmentSchema = z.object({
  label: z.string().trim().min(2, "Attachment label is required.").max(80, "Attachment label is too long."),
  url: z.string().trim().url("Attachment URL must be valid.").max(1000, "Attachment URL is too long."),
  fileName: z.string().trim().min(1, "Attachment file name is required.").max(200, "Attachment file name is too long."),
  publicId: z.string().trim().min(1, "Attachment public ID is required.").max(200, "Attachment public ID is too long."),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80, "Name is too long.").regex(/^[A-Za-z0-9 .,'-]+$/, "Name contains invalid characters."),
  phone: z.string().trim().min(7, "Phone number is too short.").max(20, "Phone number is too long.").regex(/^[0-9+\- ()]+$/, "Phone number contains invalid characters."),
  location: z.string().trim().min(2, "Location is required.").max(120, "Location is too long."),
  type: z.enum(["quote", "contact", "order"]).optional().default("contact"),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(1200, "Message is too long."),
  attachments: z.array(leadAttachmentSchema).max(20, "Too many attachments.").default([]),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(3, "Username is too short.").max(40, "Username is too long."),
  password: z.string().min(6, "Password must be at least 6 characters.").max(200, "Password is too long."),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["new", "in-progress", "closed"]).optional(),
  visitConfirmed: z.boolean().optional(),
  installationCompleted: z.boolean().optional(),
}).refine((payload) => payload.status !== undefined || payload.visitConfirmed !== undefined || payload.installationCompleted !== undefined, {
  message: "At least one field is required.",
});

export function formatZodErrors(error: z.ZodError) {
  const fieldErrors = error.issues.reduce<Record<string, string[]>>((accumulator, issue) => {
    const field = issue.path.join(".") || "form";
    if (!accumulator[field]) {
      accumulator[field] = [];
    }
    accumulator[field].push(issue.message);
    return accumulator;
  }, {});

  return {
    message: error.issues[0]?.message || "Invalid request data.",
    fieldErrors,
  };
}
