"use client";

import { useEffect, useState } from "react";
import type { LeadProgressUpdate, LeadRecord } from "@/types/lead";
import StatusPopup from "@/components/shared/StatusPopup";

export default function AdminLeadsTable() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [selected, setSelected] = useState<LeadRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadRecord["status"]>("all");
  const [progressFilter, setProgressFilter] = useState<"all" | "visit-pending" | "visit-confirmed" | "installed">("all");

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads", { method: "GET", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        const fieldMessages = data.fieldErrors ? Object.values(data.fieldErrors).flat().join(" ") : "";
        setError([data.error || "Unable to fetch leads.", fieldMessages].filter(Boolean).join(" "));
        return;
      }
      setLeads(data.data || []);
    } catch {
      setError("Unable to fetch leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const totals = {
    all: leads.length,
    installed: leads.filter((lead) => lead.installationCompleted).length,
    visitConfirmed: leads.filter((lead) => lead.visitConfirmed).length,
    openPipeline: leads.filter((lead) => !lead.installationCompleted).length,
  };

  const filteredLeads = leads.filter((lead) => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.phone.toLowerCase().includes(normalizedQuery) ||
      lead.location.toLowerCase().includes(normalizedQuery);

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "visit-pending" && !lead.visitConfirmed) ||
      (progressFilter === "visit-confirmed" && lead.visitConfirmed && !lead.installationCompleted) ||
      (progressFilter === "installed" && lead.installationCompleted);

    return matchesQuery && matchesStatus && matchesProgress;
  });

  async function updateLead(id: string, payload: LeadProgressUpdate) {
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const fieldMessages = data.fieldErrors ? Object.values(data.fieldErrors).flat().join(" ") : "";
        setNotice({
          message: [data.error || "Unable to update lead.", fieldMessages].filter(Boolean).join(" "),
          tone: "error",
        });
        return;
      }

      await loadLeads();
      setNotice({ message: "Lead updated successfully.", tone: "success" });
    } catch {
      setNotice({ message: "Unable to update lead.", tone: "error" });
    }
  }

  async function removeLead(id: string) {
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        const fieldMessages = data.fieldErrors ? Object.values(data.fieldErrors).flat().join(" ") : "";
        setNotice({
          message: [data.error || "Unable to delete lead.", fieldMessages].filter(Boolean).join(" "),
          tone: "error",
        });
        return;
      }

      await loadLeads();
      setNotice({ message: "Lead deleted successfully.", tone: "success" });
    } catch {
      setNotice({ message: "Unable to delete lead.", tone: "error" });
    }
  }

  if (loading) {
    return <p>Loading leads...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (leads.length === 0) {
    return <p>No leads found yet.</p>;
  }

  return (
    <>
      {notice ? <StatusPopup message={notice.message} tone={notice.tone} onClose={() => setNotice(null)} /> : null}
      <section className="admin-kpi-grid" aria-label="Lead overview">
        <article className="admin-kpi-card">
          <p>Total Leads</p>
          <strong>{totals.all}</strong>
        </article>
        <article className="admin-kpi-card">
          <p>Installations Done</p>
          <strong>{totals.installed}</strong>
        </article>
        <article className="admin-kpi-card">
          <p>Visit Confirmed</p>
          <strong>{totals.visitConfirmed}</strong>
        </article>
        <article className="admin-kpi-card">
          <p>Open Pipeline</p>
          <strong>{totals.openPipeline}</strong>
        </article>
      </section>

      <section className="admin-toolbar" aria-label="Lead filters">
        <label>
          Search
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, phone, or location"
          />
        </label>
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | LeadRecord["status"])}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          Progress
          <select
            value={progressFilter}
            onChange={(event) =>
              setProgressFilter(event.target.value as "all" | "visit-pending" | "visit-confirmed" | "installed")
            }
          >
            <option value="all">All</option>
            <option value="visit-pending">Visit Pending</option>
            <option value="visit-confirmed">Visit Confirmed</option>
            <option value="installed">Installed</option>
          </select>
        </label>
        <button type="button" className="button button-outline" onClick={loadLeads}>
          Refresh
        </button>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Type</th>
              <th>Date</th>
              <th>Workflow</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <div className="admin-primary-cell">
                    <strong>{lead.name}</strong>
                  </div>
                </td>
                <td>{lead.phone}</td>
                <td>{lead.location}</td>
                <td>{lead.type}</td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="workflow-steps">
                    <button
                      type="button"
                      className={`workflow-step ${lead.visitConfirmed ? "workflow-step-done" : ""}`}
                      onClick={() => {
                        const nextVisitConfirmed = !lead.visitConfirmed;
                        updateLead(lead._id, {
                          visitConfirmed: nextVisitConfirmed,
                          installationCompleted: nextVisitConfirmed ? lead.installationCompleted : false,
                        });
                      }}
                    >
                      {lead.visitConfirmed ? "✓" : "○"} Visit Confirmed
                    </button>
                    <button
                      type="button"
                      className={`workflow-step ${lead.installationCompleted ? "workflow-step-done" : ""}`}
                      onClick={() =>
                        updateLead(lead._id, {
                          visitConfirmed: true,
                          installationCompleted: !lead.installationCompleted,
                        })
                      }
                    >
                      {lead.installationCompleted ? "✓" : "○"} Installation Done
                    </button>
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <span className={`admin-status-badge admin-status-${lead.status}`}>{lead.status}</span>
                    <button type="button" className="button button-outline" onClick={() => setSelected(lead)}>
                      View
                    </button>
                    <button type="button" className="button button-danger" onClick={() => removeLead(lead._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 ? <p className="admin-empty-state">No leads matched your current filters.</p> : null}

      {selected ? (
        <div className="content-card admin-detail-card" style={{ marginTop: "1rem" }}>
          <div className="admin-detail-head">
            <h3>Lead Details</h3>
            <button type="button" className="button button-outline" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <div className="admin-detail-grid">
            <p>
              <strong>Name</strong>
              <span>{selected.name}</span>
            </p>
            <p>
              <strong>Phone</strong>
              <span>{selected.phone}</span>
            </p>
            <p>
              <strong>Location</strong>
              <span>{selected.location}</span>
            </p>
            <p>
              <strong>Type</strong>
              <span>{selected.type}</span>
            </p>
            <p>
              <strong>Status</strong>
              <span>{selected.status}</span>
            </p>
            <p>
              <strong>Visit Confirmed</strong>
              <span>{selected.visitConfirmed ? "Yes" : "No"}</span>
            </p>
            <p>
              <strong>Installation Completed</strong>
              <span>{selected.installationCompleted ? "Yes" : "No"}</span>
            </p>
            <p>
              <strong>Submitted At</strong>
              <span>{new Date(selected.createdAt).toLocaleString()}</span>
            </p>
          </div>
          <p className="admin-detail-message">
            <strong>Message</strong>
            <span>{selected.message || "No message provided."}</span>
          </p>
          {selected.attachments?.length ? (
            <div className="admin-attachments">
              <strong>Uploaded Documents</strong>
              <ul>
                {selected.attachments.map((attachment) => (
                  <li key={`${attachment.label}-${attachment.publicId}`}>
                    <span>{attachment.label}</span>
                    <a href={attachment.url} target="_blank" rel="noreferrer">
                      View file
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
