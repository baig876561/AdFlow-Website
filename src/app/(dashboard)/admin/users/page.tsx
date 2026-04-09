"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((r) => { if (r.success) setUsers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted mt-1">{users.length} registered user(s)</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${user.status === "active" ? "text-success" : "text-destructive"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-success" : "bg-destructive"}`} />
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-muted">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
