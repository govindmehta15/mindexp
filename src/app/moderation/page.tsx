import { posts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SummarizePostClient } from './summarize-post-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ModerationPage() {
  const flaggedPosts = posts.filter(p => p.isFlagged);

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Review and take action on flagged content.
        </p>
      </header>

      {flaggedPosts.length > 0 ? (
        <div className="space-y-8">
          {flaggedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                <CardDescription>
                  Posted by {post.author.isAnonymous ? 'Anonymous' : post.author.name} on {post.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg font-headline">Original Post</h3>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Flagged for Review</AlertTitle>
                      <AlertDescription>
                        {post.flagReason || 'Reason not specified.'}
                      </AlertDescription>
                    </Alert>
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="text-muted-foreground">{post.content}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-semibold text-lg font-headline">AI-Assisted Moderation</h3>
                    <SummarizePostClient postContent={post.content} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold">Queue is Clear!</h3>
            <p className="text-muted-foreground mt-2">There are no flagged posts to review at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
