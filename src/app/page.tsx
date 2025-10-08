import { channels } from '@/lib/data';
import type { Channel } from '@/lib/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Community Forums</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Find your space. Connect with peers, share experiences, and find support.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel: Channel) => (
          <Link href={`/community/${channel.id}`} key={channel.id} className="group">
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{channel.name}</CardTitle>
                <CardDescription className="text-base">{channel.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{channel.postCount} posts</span>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Join <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
