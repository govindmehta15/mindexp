import type { Metadata } from 'next';
import { AppHeader } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Atom } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MindExp',
  description: 'A safer place for student wellbeing — peer support, clinician-backed resources, and research that works.',
};

const navItems = [
    { href: "/community", label: "Community" },
    { href: "/resources", label: "Resources" },
    { href: "/events", label: "Events" },
    { href: "/professionals", label: "For Professionals" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-secondary text-secondary-foreground py-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-4">
                 <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
                    <Atom className="w-8 h-8 text-primary" />
                    MindExp
                </Link>
                <p className="text-muted-foreground">A safer place for student wellbeing.</p>
              </div>
              <div>
                <h4 className="font-headline font-semibold mb-4">Navigate</h4>
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.label}>
                            <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
              </div>
               <div>
                <h4 className="font-headline font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                    <li>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                    </li>
                     <li>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Data Retention Policy</Link>
                    </li>
                </ul>
              </div>
               <div>
                <h4 className="font-headline font-semibold mb-4">About Us</h4>
                <ul className="space-y-2">
                     <li>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Clinical Advisory Board</Link>
                    </li>
                     <li>
                        <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Crisis Protocol</Link>
                    </li>
                </ul>
              </div>
            </div>
             <div className="container mx-auto mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} MindExp. All rights reserved.
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
