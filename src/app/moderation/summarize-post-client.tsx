'use client';

import { useState } from 'react';
import { summarizeCommunityPost, type SummarizeCommunityPostOutput } from '@/ai/flows/summarize-community-posts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const defaultPolicy = `
- Prohibit hate speech, harassment, and bullying.
- Disallow explicit or violent content.
- Prevent the sharing of personal identifiable information (PII) without consent.
- Flag posts indicating self-harm or immediate danger to self or others for urgent review.
- Mild profanity is acceptable, but excessive or targeted abusive language is not.
`.trim();

export function SummarizePostClient({ postContent }: { postContent: string }) {
  const [moderationPolicy, setModerationPolicy] = useState(defaultPolicy);
  const [includeUserInfo, setIncludeUserInfo] = useState(false);
  const [result, setResult] = useState<SummarizeCommunityPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const summaryResult = await summarizeCommunityPost({
        postContent,
        moderationPolicy,
        includeUserInfo,
      });
      setResult(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="moderation-policy">Moderation Policy</Label>
          <Textarea
            id="moderation-policy"
            value={moderationPolicy}
            onChange={(e) => setModerationPolicy(e.target.value)}
            rows={6}
            className="text-xs"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="include-user-info" className="flex flex-col">
            <span className="font-semibold">Include User Info</span>
            <span className="text-xs text-muted-foreground">Allow AI to use user identities in summary</span>
          </Label>
          <Switch
            id="include-user-info"
            checked={includeUserInfo}
            onCheckedChange={setIncludeUserInfo}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Summary
        </Button>
      </form>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Summary & Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Intervention Required</h4>
              <Badge variant={result.interventionRequired ? 'destructive' : 'default'}>
                {result.interventionRequired ? 
                <><AlertTriangle className="mr-2 h-4 w-4" /> Yes</> : 
                <><CheckCircle className="mr-2 h-4 w-4" /> No</>}
              </Badge>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-1">Summary</h4>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-1">Potential Issues</h4>
              <p className="text-sm text-muted-foreground">
                {result.potentialIssues || 'No specific issues identified.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
