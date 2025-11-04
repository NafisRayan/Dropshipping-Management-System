import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardUser } from "@/lib/dashboard-data";
import { Mail, ShieldCheck } from "lucide-react";

const roleVariant: Record<string, string> = {
  admin: "bg-emerald-50 text-emerald-600",
  manager: "bg-amber-50 text-amber-600",
  customer: "bg-sky-50 text-sky-600",
};

type UsersTableProps = {
  users: DashboardUser[];
};

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">Directory snapshot</CardTitle>
            <CardDescription>Latest accounts synced from the Nest backend</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full border-primary/30 text-xs text-primary self-start sm:self-auto">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> JWT secured
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Created</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{user.fullName}</span>
                    <span className="text-xs text-muted-foreground">{user.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className={`rounded-full px-2 py-1 text-xs ${roleVariant[user.role?.toLowerCase() ?? "customer"] ?? roleVariant.customer}`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={user.isActive ? "secondary" : "outline"} className="rounded-full px-2 py-1 text-xs">
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
