import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  roles: string[];
}

export function KaryawanFilter({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roles,
}: Props) {
  return (
    <Card className="border-[#c9d6df]">
      <CardHeader>
        <CardTitle
          className="text-[#1e6091]"
          style={{ fontFamily: "Pirata One, cursive" }}
        >
          Filter & Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari karyawan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-[#c9d6df] focus-visible:ring-[#1e6091]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#c9d6df]">
                <Filter className="mr-2 h-4 w-4" />
                {selectedRole === "all" ? "Semua Posisi" : selectedRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {roles.map((role) => (
                <DropdownMenuItem key={role} onClick={() => onRoleChange(role)}>
                  {role === "all" ? "Semua Posisi" : role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
