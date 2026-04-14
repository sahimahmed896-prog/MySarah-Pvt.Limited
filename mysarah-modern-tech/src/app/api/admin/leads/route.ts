import { NextResponse } from "next/server";
import { getLeads } from "@/lib/lead-service";
import { getAdminSession } from "@/lib/auth";
import { rejectUntrustedOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const blocked = rejectUntrustedOrigin(request);
  if (blocked) {
    return blocked;
  }

  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getLeads();
    return NextResponse.json({ ok: true, data: leads });
  } catch {
    return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
  }
}
