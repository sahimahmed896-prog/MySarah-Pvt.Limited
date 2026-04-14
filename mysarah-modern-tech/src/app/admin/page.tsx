import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLeadsTable from "@/components/admin/AdminLeadsTable";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mysarah Modern Tech",
  description: "Mini CRM dashboard for lead management.",
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="section container">
      <div className="admin-shell">
        <header className="admin-head">
          <div>
            <p className="admin-kicker">Operations Console</p>
            <h1>Lead Dashboard</h1>
            <p className="admin-subtitle">Manage incoming enquiries, track field visits, and close installations.</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="button button-outline" type="submit">
              Logout
            </button>
          </form>
        </header>
      </div>
      <AdminLeadsTable />
    </main>
  );
}
