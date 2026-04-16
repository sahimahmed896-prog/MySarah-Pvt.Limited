import { connectDb } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";
import type { LeadInput, LeadProgressUpdate, LeadStatus } from "@/types/lead";

const geocodeCache = new Map<string, { latitude: number | null; longitude: number | null }>();

async function geocodeLocation(locationName: string) {
  const key = locationName.trim().toLowerCase();
  if (geocodeCache.has(key)) {
    return geocodeCache.get(key) as { latitude: number | null; longitude: number | null };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationName)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "mysarah-modern-tech/1.0",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      geocodeCache.set(key, { latitude: null, longitude: null });
      return { latitude: null, longitude: null };
    }

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    const first = data[0];
    const coordinates = first
      ? {
          latitude: Number(first.lat),
          longitude: Number(first.lon),
        }
      : { latitude: null, longitude: null };

    geocodeCache.set(key, coordinates);
    return coordinates;
  } catch {
    geocodeCache.set(key, { latitude: null, longitude: null });
    return { latitude: null, longitude: null };
  }
}

export async function createLead(input: LeadInput) {
  await connectDb();
  return Lead.create({ ...input, attachments: input.attachments || [] });
}

export async function getLeads() {
  await connectDb();
  return Lead.find().sort({ createdAt: -1 }).lean();
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

  return Lead.findByIdAndUpdate(
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
}

export async function getSolarInsights() {
  await connectDb();

  const installedLeads = await Lead.find({ installationCompleted: true })
    .sort({ installedAt: -1, updatedAt: -1 })
    .lean();

  const visitConfirmedCount = await Lead.countDocuments({ visitConfirmed: true });
  const pipelineOpenCount = await Lead.countDocuments({ installationCompleted: false });
  const totalLeads = await Lead.countDocuments();

  const locationsMap = new Map<string, number>();
  for (const lead of installedLeads) {
    const key = String(lead.location || "Unknown").trim() || "Unknown";
    locationsMap.set(key, (locationsMap.get(key) || 0) + 1);
  }

  const baseLocations = Array.from(locationsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const locations = await Promise.all(
    baseLocations.map(async (location) => {
      const coordinates = await geocodeLocation(location.name);
      return {
        ...location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
    }),
  );

  const recentInstallations = installedLeads.slice(0, 6).map((lead) => ({
    id: String(lead._id),
    name: lead.name,
    location: lead.location,
    installedAt: new Date(lead.installedAt || lead.updatedAt || lead.createdAt).toISOString(),
  }));

  const installedCount = installedLeads.length;

  return {
    totals: {
      installed: installedCount,
      visitConfirmed: visitConfirmedCount,
      pipelineOpen: pipelineOpenCount,
      completionRate: totalLeads > 0 ? Math.round((installedCount / totalLeads) * 100) : 0,
    },
    locations,
    recentInstallations,
  };
}

export async function deleteLead(id: string) {
  await connectDb();
  return Lead.findByIdAndDelete(id).lean();
}
