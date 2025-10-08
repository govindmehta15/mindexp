import type { Metadata } from 'next';
import { AppHeader } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Atom, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'MindExp — Global Student Support & Mental Health Ecosystem',
  description: 'Join MindExp — a safe, smart, and supportive space for every student’s growth, wellness, and innovation.',
  keywords: 'student mental health, community support, self-assessment, global research, student well-being',
};

const navItems = [
    { href: "/community", label: "Community" },
    { href: "/assessments", label: "Assessments" },
    { href: "/research", label: "Research" },
    { href: "/resources", label: "Resources" },
    { href: "/content", label: "Content" },
    { href: "/about", label: "About" },
];

const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/crisis-help", label: "Crisis Help" },
]

const socialLinks = [
    { href: "#", icon: Linkedin, label: "LinkedIn"},
    { href: "#", icon: Twitter, label: "X"},
    { href: "#", icon: Instagram, label: "Instagram"},
    { href: "#", icon: Youtube, label: "YouTube"},
]

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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <SidebarProvider>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-card text-card-foreground py-12">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="flex flex-col gap-4 md:col-span-4">
                  <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-headline">
                      <Atom className="w-8 h-8 text-primary" />
                      MindExp
                  </Link>
                </div>
                <div className="md:col-span-4">
                  <h4 className="font-headline font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                      {footerLinks.map(item => (
                          <li key={item.label}>
                              <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                                  {item.label}
                              </Link>
                          </li>
                      ))}
                  </ul>
                </div>
                <div className="md:col-span-4 space-y-4">
                   <h4 className="font-headline font-semibold">Stay updated</h4>
                   <p className="text-sm text-muted-foreground">Stay updated with new projects and opportunities.</p>
                   <form className="flex gap-2">
                    <Input type="email" placeholder="Enter your email" className="flex-1" />
                    <Button type="submit">Subscribe</Button>
                   </form>
                   <div className="flex items-center gap-4 pt-2">
                        {socialLinks.map(item => (
                            <Link key={item.label} href={item.href} aria-label={item.label} className="text-muted-foreground hover:text-primary transition-colors">
                                <item.icon className="w-6 h-6" />
                            </Link>
                        ))}
                    </div>
                </div>
              </div>
              <div className="container mx-auto mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
                  &copy; {new Date().getFullYear()} MindExp. All rights reserved.
              </div>
            </footer>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
