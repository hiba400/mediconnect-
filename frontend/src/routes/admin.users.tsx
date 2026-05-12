import { createFileRoute } from "@tanstack/react-router";
import { Search, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { useUsers } from "@/hooks/useUsers";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const { data: apiUsers, isLoading } = useUsers();

  const users = React.useMemo(() => {
    if (!apiUsers) return [];
    return apiUsers.map(u => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      role: u.role === 0 ? "patient" : u.role === 1 ? "doctor" : "admin",
      status: u.isActive ? "active" : "inactive",
      joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Today",
    }));
  }, [apiUsers]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User management</h1>
          <p className="text-sm text-muted-foreground">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border bg-background w-72">
          <Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0" />
        </div>
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar><div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></TableCell>
                <TableCell><Badge variant={u.role === "doctor" ? "default" : u.role === "admin" ? "destructive" : "outline"} className="capitalize">{u.role}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                <TableCell><Badge className={u.status === "active" ? "bg-success/15 text-success border-0" : "bg-destructive/15 text-destructive border-0"}>{u.status}</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
