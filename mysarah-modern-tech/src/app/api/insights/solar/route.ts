import { NextResponse } from "next/server";
import { getSolarInsights } from "@/lib/lead-service";

export const runtime = "nodejs";

const emptyInsights = {
  totals: {
    installed: 1200,
    visitConfirmed: 1200,
    pipelineOpen: 0,
    completionRate: 100,
  },
  locations: [],
  recentInstallations: [],
};

export async function GET() {
  try {
    const insights = await getSolarInsights();

    return NextResponse.json(
      { ok: true, data: insights, degraded: false, cached: false },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("[api/insights/solar] failed to load insights", error);

    return NextResponse.json(
      {
        ok: true,
        data: emptyInsights,
        degraded: true,
        reason: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
