
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { resources } from '@/lib/data';
import {
  Download,
  Share2,
  Bookmark,
  BookOpen,
  Mic,
  Video,
  FileText,
  Paperclip,
} from 'lucide-react';

const iconMap = {
  Article: FileText,
  Video: Video,
  Podcast: Mic,
  Guide: BookOpen,
  Misc: Paperclip,
};

function renderMedia(resource: (typeof resources)[0]) {
  switch (resource.type) {
    case 'Video':
      return (
        <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
          <p className="text-white">Video Player Placeholder</p>
        </div>
      );
    case 'Podcast':
      return (
        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Audio Player Placeholder</p>
        </div>
      );
    case 'Article':
    case 'Guide':
    default:
      return (
        <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            data-ai-hint={resource.imageHint}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-lg font-semibold">
              PDF Preview Placeholder
            </p>
          </div>
        </div>
      );
  }
}

export default function ContentPage() {
  const params = useParams();
  const id = params.id as string;
  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    notFound();
  }

  const Icon =
    iconMap[resource.type as keyof typeof iconMap] || iconMap['Misc'];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/content">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Hub
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Icon className="h-4 w-4" />
            <span>{resource.type}</span>
          </div>
          <CardTitle className="font-headline text-3xl md:text-4xl">
            {resource.title}
          </CardTitle>
          <CardDescription className="pt-2">
            By{' '}
            <span className="text-primary font-medium">
              {resource.author || 'MindExp Team'}
            </span>{' '}
            &middot; Published on {resource.publicationDate || 'October 2025'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-muted-foreground">
            {resource.description}
          </div>
          <Separator />
          {renderMedia(resource)}
          <Separator />
          <div className="flex flex-wrap gap-2">
            {(resource.tags || []).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button>
            <Download className="mr-2" /> Download
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2" /> Share
          </Button>
          <Button variant="outline">
            <Bookmark className="mr-2" /> Bookmark
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
