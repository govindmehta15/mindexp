import { posts } from '@/lib/data';
import type { Post, Reply, User } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function ReplyCard({ reply }: { reply: Reply }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-4">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={reply.author.avatarUrl} />
          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{reply.author.isAnonymous ? 'Anonymous' : reply.author.name}</span>
            <span className="text-muted-foreground">&middot;</span>
            <span className="text-muted-foreground">{reply.createdAt}</span>
          </div>
          <p className="mt-1 text-base">{reply.content}</p>
        </div>
      </div>
      {reply.replies && reply.replies.length > 0 && (
        <div className="ml-8 mt-4 pl-4 border-l-2 space-y-4">
          {reply.replies.map(r => <ReplyCard key={r.id} reply={r} />)}
        </div>
      )}
    </div>
  );
}

export default function PostPage({ params }: { params: { postId: string } }) {
  const post = posts.find((p) => p.id === params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          {post.isFlagged && <Badge variant="destructive" className="mb-2 w-fit">Flagged for Review</Badge>}
          <CardTitle className="font-headline text-3xl md:text-4xl">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{post.author.isAnonymous ? 'Anonymous' : post.author.name}</span>
            <span>&middot;</span>
            <span>{post.createdAt}</span>
          </div>
        </CardHeader>
        <CardContent className="text-lg leading-relaxed">
          <p>{post.content}</p>
        </CardContent>
      </Card>

      <Separator className="my-8" />
      
      <h2 className="font-headline text-2xl font-bold mb-6">{post.replies.length} Replies</h2>

      <div className="space-y-8 mb-8">
        {post.replies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
      </div>
      
      <Card>
        <CardHeader>
            <h3 className="font-headline text-xl font-bold">Add a reply</h3>
        </CardHeader>
        <CardContent>
             <Textarea placeholder="Share your thoughts..." rows={4} />
        </CardContent>
        <CardFooter className='flex justify-end'>
            <Button>Submit Reply</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
