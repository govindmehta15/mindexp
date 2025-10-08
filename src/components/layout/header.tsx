"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Atom, Menu, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/community", label: "Community" },
    { href: "/assessments", label: "Assessments" },
    { href: "/research", label: "Research" },
    { href: "/content", label: "Content" },
    { href: "/about", label: "About" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2 font-bold text-xl font-headline">
          <Atom className="w-8 h-8 text-primary" />
          MindExp
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Language</span>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="green-gradient text-white">
                <Link href="/signup">Sign Up</Link>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                     <Link href="/" className="mr-6 flex items-center gap-2 font-bold text-xl font-headline mb-6">
                        <Atom className="w-8 h-8 text-primary" />
                        MindExp
                    </Link>
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                             <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "font-medium transition-colors hover:text-primary",
                                    pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
