import { connectDb } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";
import { SolarCounter } from "@/lib/models/SolarCounter";
import type { LeadInput, LeadProgressUpdate, LeadStatus } from "@/types/lead";

const HISTORICAL_BASELINE = 1200;

function toPlainLead<T>(value: T) {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function ensureSolarCounter() {
  const existing = await SolarCounter.findOne({ scope: "global" }).lean();
  if (existing) {
    return existing;
  }

  try {
    await SolarCounter.create({
      scope: "global",
      installedTotal: HISTORICAL_BASELINE,
      visitConfirmedTotal: HISTORICAL_BASELINE,
    });
  } catch {
    // Another request may have initialized the singleton counter concurrently.
  }

  const persisted = await SolarCounter.findOne({ scope: "global" }).lean();
  if (persisted) {
    return persisted;
  }

  return {
    scope: "global",
    installedTotal: HISTORICAL_BASELINE,
    visitConfirmedTotal: HISTORICAL_BASELINE,
  };
}

export async function createLead(input: LeadInput) {
  await connectDb();
  return Lead.create({
    ...input,
    type: input.type || "contact",
    attachments: input.attachments || [],
  });
}

export async function getLeads() {
  await connectDb();
  return Lead.find(
    {},
    {
      _id: 1,
      name: 1,
      phone: 1,
      location: 1,
      type: 1,
      status: 1,
      visitConfirmed: 1,
      installationCompleted: 1,
      createdAt: 1,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
}

export async function getLeadById(id: string) {
  await connectDb();
  const lead = await Lead.findById(id).lean();
  return lead ? toPlainLead(lead) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await connectDb();
  return Lead.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function updateLeadProgress(id: string, update: LeadProgressUpdate) {
  await connectDb();

  const current = await Lead.findById(id).lean();
  if (!current) {
    return null;
  }

  const nextVisitConfirmed = update.visitConfirmed ?? current.visitConfirmed ?? false;
  const nextInstallationCompleted = update.installationCompleted ?? current.installationCompleted ?? false;

  let nextStatus: LeadStatus = update.status ?? current.status;
  if (nextInstallationCompleted) {
    nextStatus = "closed";
  } else if (nextVisitConfirmed) {
    nextStatus = "in-progress";
  } else if (!update.status) {
    nextStatus = "new";
  }

  const nextInstalledAt = nextInstallationCompleted
    ? current.installedAt || new Date()
    : null;

  const updated = await Lead.findByIdAndUpdate(
    id,
    {
      ...update,
      visitConfirmed: nextVisitConfirmed,
      installationCompleted: nextInstallationCompleted,
      status: nextStatus,
      installedAt: nextInstalledAt,
    },
    { new: true },
  ).lean();

  const inc: { installedTotal?: number; visitConfirmedTotal?: number } = {};
  if (!current.visitConfirmed && nextVisitConfirmed) {
    inc.visitConfirmedTotal = 1;
  }
  if (!current.installationCompleted && nextInstallationCompleted) {
    inc.installedTotal = 1;
  }

  if (inc.installedTotal || inc.visitConfirmedTotal) {
    await ensureSolarCounter();
    await SolarCounter.updateOne({ scope: "global" }, { $inc: inc });
  }

  return updated;
}

export async function getSolarInsights() {
  await connectDb();

  const [counter, installedFromLeads, visitConfirmedFromLeads, pipelineOpenCount] = await Promise.all([
    ensureSolarCounter(),
    Lead.countDocuments({ installationCompleted: true }),
    Lead.countDocuments({ visitConfirmed: true }),
    Lead.countDocuments({ installationCompleted: false }),
  ]);

  const observedInstalled = HISTORICAL_BASELINE + installedFromLeads;
  const observedVisitConfirmed = HISTORICAL_BASELINE + visitConfirmedFromLeads;

  let installedCount = counter.installedTotal ?? HISTORICAL_BASELINE;
  let visitConfirmedCount = counter.visitConfirmedTotal ?? HISTORICAL_BASELINE;

  const syncInstalledTo = Math.max(installedCount, observedInstalled);
  const syncVisitTo = Math.max(visitConfirmedCount, observedVisitConfirmed);

  if (syncInstalledTo !== installedCount || syncVisitTo !== visitConfirmedCount) {
    await SolarCounter.updateOne(
      { scope: "global" },
      {
        $set: {
          installedTotal: syncInstalledTo,
          visitConfirmedTotal: syncVisitTo,
        },
      },
    );

    installedCount = syncInstalledTo;
    visitConfirmedCount = syncVisitTo;
  }

  const completionRate = visitConfirmedCount > 0
    ? Math.min(100, Math.round((installedCount / visitConfirmedCount) * 100))
    : 0;

  return {
    totals: {
      installed: installedCount,
      visitConfirmed: visitConfirmedCount,
      pipelineOpen: pipelineOpenCount,
      completionRate,
    },
    locations: [],
    recentInstallations: [],
  };
}

export async function deleteLead(id: string) {
  await connectDb();
  return Lead.findByIdAndDelete(id).lean();
}
