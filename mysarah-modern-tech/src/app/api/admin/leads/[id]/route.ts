import { NextResponse } from "next/server";
import { deleteLead, updateLeadProgress } from "@/lib/lead-service";
import { getAdminSession } from "@/lib/auth";
import { updateLeadStatusSchema } from "@/lib/validation";
import { rejectCrossSiteRequest } from "@/lib/security";

interface LeadParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: LeadParams) {
  const blocked = rejectCrossSiteRequest(request);
  if (blocked) {
    return blocked;
  }

  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateLeadStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
    }

    const { id } = await params;
    const result = await updateLeadProgress(id, parsed.data);
    if (!result) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: result });
  } catch {
    return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: LeadParams) {
  const blocked = rejectCrossSiteRequest(request);
  if (blocked) {
    return blocked;
  }

  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await deleteLead(id);

    if (!result) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete lead." }, { status: 500 });
  }
}
