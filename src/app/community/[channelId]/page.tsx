import { channels, posts as allPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { AppSidebar } from '@/components/layout/sidebar';

export default function ChannelPage({ params }: { params: { channelId: string } }) {
  const channel = channels.find((c) => c.id === params.channelId);
  const posts = allPosts.filter((p) => p.channelId === params.channelId);

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">{channel.name}</h1>
                <p className="text-muted-foreground mt-2 text-lg">{channel.description}</p>
                </div>
                <Button className="mt-4 md:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
                </Button>
            </header>

            <div className="space-y-6">
                {posts.length > 0 ? (
                posts.map((post) => (
                    <Link href={`/community/${channel.id}/${post.id}`} key={post.id} className="block">
                    <Card className="hover:bg-secondary/50 transition-colors">
                        <CardHeader>
                        <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="line-clamp-2 text-muted-foreground">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.isAnonymous ? 'Anonymous' : post.author.name}</span>
                            <span className="hidden md:inline-block">&middot;</span>
                            <span className="hidden md:inline-block">{post.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {post.isFlagged && <Badge variant="destructive">Flagged</Badge>}
                            <div className="flex items-center">
                            <MessageCircle className="mr-1.5 h-4 w-4" />
                            {post.replies.length}
                            </div>
                        </div>
                        </CardFooter>
                    </Card>
                    </Link>
                ))
                ) : (
                <Card className="text-center py-12">
                    <CardContent>
                    <h3 className="text-xl font-semibold">No posts yet</h3>
                    <p className="text-muted-foreground mt-2">Be the first to start a conversation in this channel.</p>
                    </CardContent>
                </Card>
                )}
            </div>
        </div>
    </div>
  );
}
