import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { getAdminSession } from "@/lib/auth";
import { getLeadById } from "@/lib/lead-service";
import { rejectUntrustedOrigin } from "@/lib/security";
import { parseApplicationSummary, sanitizePdfFileName, sortLeadAttachments } from "@/lib/lead-document";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rejectUntrustedOrigin(request);
  if (blocked) {
    return blocked;
  }

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const fontSize = 11;
    const margin = 40;
    const pageWidth = 595 - 2 * margin;
    let yPosition = 800;

    // Embed fonts upfront
    const helveticaFont = await pdfDoc.embedFont("Helvetica");
    const helveticaBoldFont = await pdfDoc.embedFont("Helvetica-Bold");

    const darkGreen = rgb(0.08, 0.22, 0.17); // #143a2a
    const mediumGreen = rgb(0.36, 0.53, 0.46); // #5d7464
    const lightGreen = rgb(0.85, 0.9, 0.85); // #d8e5d9
    const black = rgb(0, 0, 0);

    const drawText = (text: string, size: number, color: ReturnType<typeof rgb>, bold: boolean = false) => {
      const lines = text.split('\n');
      for (const line of lines) {
        if (yPosition < margin + 40) {
          yPosition = 800;
          pdfDoc.addPage([595, 842]);
        }
        page.drawText(line.substring(0, 200), {
          x: margin,
          y: yPosition,
          size,
          color,
          font: bold ? helveticaBoldFont : helveticaFont,
        });
        yPosition -= size + 4;
      }
    };

    const summary = parseApplicationSummary(lead.message || "");
    const attachments = sortLeadAttachments(lead.attachments || []);
    const fileName = sanitizePdfFileName(lead.name || "lead");

    // Title
    page.drawText("Lead Document Sheet", {
      x: margin,
      y: yPosition,
      size: 22,
      color: darkGreen,
      font: helveticaBoldFont,
    });
    yPosition -= 30;

    // Subtitle
    page.drawText(`Applicant: ${lead.name} | Generated for admin review`, {
      x: margin,
      y: yPosition,
      size: 11,
      color: mediumGreen,
      font: helveticaFont,
    });
    yPosition -= 30;

    // Identity Summary
    page.drawText("Identity Summary", {
      x: margin,
      y: yPosition,
      size: 15,
      color: darkGreen,
      font: helveticaBoldFont,
    });
    yPosition -= 25;

    const identityData = [
      { label: "Name", value: lead.name || "Not provided" },
      { label: "Phone", value: lead.phone || "Not provided" },
      { label: "Location", value: lead.location || "Not provided" },
      { label: "Type", value: lead.type || "Not provided" },
      { label: "Status", value: lead.status || "Not provided" },
      { label: "Submitted", value: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(lead.createdAt)) },
    ];

    for (const item of identityData) {
      page.drawText(`${item.label}: ${item.value}`, {
        x: margin,
        y: yPosition,
        size: 10,
        color: darkGreen,
        font: helveticaFont,
      });
      yPosition -= 16;
    }

    yPosition -= 10;

    // Application Summary
    page.drawText(summary.headline, {
      x: margin,
      y: yPosition,
      size: 15,
      color: darkGreen,
      font: helveticaBoldFont,
    });
    yPosition -= 25;

    page.drawText("Parsed application details:", {
      x: margin,
      y: yPosition,
      size: 10,
      color: mediumGreen,
      font: helveticaFont,
    });
    yPosition -= 18;

    const fieldEntries = Object.entries(summary.fields);
    for (const [key, value] of fieldEntries) {
      page.drawText(`${key}: ${value}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        color: black,
        font: helveticaFont,
      });
      yPosition -= 14;
    }

    if (summary.requiredDocuments.length > 0) {
      yPosition -= 10;
      page.drawText("Document Checklist", {
        x: margin,
        y: yPosition,
        size: 12,
        color: rgb(0.56, 0.42, 0.13), // #8f6a22
        font: helveticaBoldFont,
      });
      yPosition -= 20;

      for (const item of summary.requiredDocuments) {
        page.drawText(`• ${item.label}: ${item.value}`, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          color: darkGreen,
          font: helveticaFont,
        });
        yPosition -= 14;
      }
    }

    if (summary.notes) {
      yPosition -= 10;
      page.drawText("Notes", {
        x: margin,
        y: yPosition,
        size: 12,
        color: rgb(0.56, 0.42, 0.13),
        font: helveticaBoldFont,
      });
      yPosition -= 20;

      const noteLines = summary.notes.split('\n');
      for (const line of noteLines) {
        page.drawText(line.substring(0, 150), {
          x: margin + 10,
          y: yPosition,
          size: 9,
          color: darkGreen,
          font: helveticaFont,
        });
        yPosition -= 14;
      }
    }

    yPosition -= 10;

    // Attachments Summary
    if (attachments.length > 0) {
      page.drawText("Attachments", {
        x: margin,
        y: yPosition,
        size: 15,
        color: darkGreen,
        font: helveticaBoldFont,
      });
      yPosition -= 25;

      for (const attachment of attachments) {
        page.drawText(`• ${attachment.label}: ${attachment.fileName}`, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          color: darkGreen,
          font: helveticaFont,
        });
        yPosition -= 14;

        if (yPosition < margin + 40) {
          yPosition = 800;
          pdfDoc.addPage([595, 842]);
        }
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/admin/leads/[id]/pdf] failed", error);
    return NextResponse.json({ error: "Unable to generate PDF." }, { status: 500 });
  }
}
