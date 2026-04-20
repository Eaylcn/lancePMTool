import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth/require-pro";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Admin Console
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kullanıcıları yönet, rolleri değiştir, sistemi izle.
          </p>
        </div>
      </div>

      <AdminUsersTable />
    </div>
  );
}
