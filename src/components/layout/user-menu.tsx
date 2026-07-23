"use client";

import { LogOut, Settings, User as UserIcon } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

export function UserMenu({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 outline-none transition-colors hover:bg-secondary/60">
        <Avatar className="size-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback>{initials(name || email)}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left md:block">
          <div className="text-sm font-medium leading-none">{name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{email}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut} className="w-full">
          <DropdownMenuItem variant="destructive" asChild>
            <button type="submit" className="w-full">
              <LogOut /> Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
