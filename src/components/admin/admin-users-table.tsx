"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Crown, Shield, Sparkles, Loader2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "free" | "premium" | "admin";

interface AdminUser {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
  locale: "tr" | "en";
  createdAt: string;
  gameCount: number;
  aiAnalysisCount: number;
}

async function fetchUsers(): Promise<{ users: AdminUser[]; total: number }> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export function AdminUsersTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const filtered = useMemo(() => {
    if (!data?.users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [data, search]);

  const counts = useMemo(() => {
    const users = data?.users ?? [];
    return {
      total: users.length,
      free: users.filter((u) => u.role === "free").length,
      premium: users.filter((u) => u.role === "premium").length,
      admin: users.filter((u) => u.role === "admin").length,
    };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Toplam" value={counts.total} accent="text-foreground" />
        <StatCard icon={Sparkles} label="Free" value={counts.free} accent="text-muted-foreground" />
        <StatCard icon={Crown} label="Premium" value={counts.premium} accent="text-amber-500" />
        <StatCard icon={Shield} label="Admin" value={counts.admin} accent="text-rose-500" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kullanıcı adı, isim veya ID ile ara..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b">
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Kullanıcı</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium text-center">Oyun</th>
                <th className="px-4 py-3 font-medium text-center">AI Analiz</th>
                <th className="px-4 py-3 font-medium">Kayıt</th>
                <th className="px-4 py-3 font-medium text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Kullanıcı bulunamadı
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <UserRow key={u.id} user={u} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${accent}`} />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const queryClient = useQueryClient();
  const [savedTick, setSavedTick] = useState(false);

  const mutation = useMutation({
    mutationFn: async (role: Role) => {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Rol güncellenemedi");
      }
      return res.json();
    },
    onSuccess: () => {
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1500);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user.username?.slice(0, 2).toUpperCase() ?? "PM");

  const roleBadge =
    user.role === "admin" ? (
      <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30">
        <Shield className="h-3 w-3" /> admin
      </Badge>
    ) : user.role === "premium" ? (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
        <Crown className="h-3 w-3" /> premium
      </Badge>
    ) : (
      <Badge variant="outline">
        <Sparkles className="h-3 w-3" /> free
      </Badge>
    );

  return (
    <tr className="border-b hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName ?? ""} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-purple-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">
              {user.fullName || user.username || "—"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.username ? `@${user.username}` : user.id.slice(0, 8) + "…"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{roleBadge}</td>
      <td className="px-4 py-3 text-center tabular-nums">{user.gameCount}</td>
      <td className="px-4 py-3 text-center tabular-nums">{user.aiAnalysisCount}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(user.createdAt).toLocaleDateString("tr-TR")}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {savedTick && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <Check className="h-3 w-3" /> kaydedildi
            </span>
          )}
          {mutation.isPending && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
          <Select
            value={user.role}
            onValueChange={(v) => {
              if (!v || v === user.role) return;
              mutation.mutate(v as Role);
            }}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {mutation.isError && (
          <p className="text-xs text-rose-500 mt-1 text-right">
            {(mutation.error as Error).message}
          </p>
        )}
      </td>
    </tr>
  );
}
