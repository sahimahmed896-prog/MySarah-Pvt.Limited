import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import LeadDocumentSheet from "@/components/admin/LeadDocumentSheet";
import { getAdminSession } from "@/lib/auth";
import { getLeadById } from "@/lib/lead-service";

export const metadata: Metadata = {
  title: "Lead Document Sheet | Mysarah Modern Tech",
  description: "Structured document view for an individual solar lead.",
};

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <main className="section container">
      <div className="admin-shell">
        <header className="admin-head">
          <div>
            <p className="admin-kicker">Operations Console</p>
            <h1>Lead Document Sheet</h1>
            <p className="admin-subtitle">A structured record page for one applicant, with identity, documents, and status in one place.</p>
          </div>
        </header>
      </div>

      <LeadDocumentSheet lead={lead} />
    </main>
  );
}
