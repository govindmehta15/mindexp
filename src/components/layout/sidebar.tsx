"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Users,
  MessageSquare,
  Library,
  Calendar,
  ShieldCheck,
  Settings,
  LogOut,
  Atom,
  BookHeart,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/community", label: "Community", icon: MessageSquare },
  { href: "/resources", label: "Resource Hub", icon: Library },
  { href: "/content", label: "Content Hub", icon: BookHeart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/professionals", label: "Professionals", icon: Users },
  { href: "/moderation", label: "Moderation", icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r" variant="sidebar">
      <SidebarHeader className="flex items-center gap-2 p-4">
        <Atom className="w-8 h-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold">MindExp</h1>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
