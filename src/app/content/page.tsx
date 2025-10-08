'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { resources } from '@/lib/data';
import type { Resource } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Mic,
  Video,
  FileText,
  Paperclip,
  Download,
  Share2,
  PlayCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  Article: FileText,
  Video: Video,
  Podcast: Mic,
  Guide: BookOpen,
  Misc: Paperclip,
};

const ContentCard = ({ resource }: { resource: Resource }) => {
  const Icon =
    iconMap[resource.type as keyof typeof iconMap] || iconMap['Misc'];

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Link href={`/content/${resource.id}`}>
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            width={400}
            height={225}
            className="w-full h-48 object-cover"
            data-ai-hint={resource.imageHint}
          />
          {resource.type === 'Video' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/80" />
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Icon className="h-4 w-4" />
          <span>{resource.type}</span>
          <span className="mx-1">&middot;</span>
          <span>{resource.publicationDate || 'Oct 2025'}</span>
        </div>
        <CardTitle className="font-headline text-lg mb-2 leading-snug">
          <Link href={`/content/${resource.id}`}>{resource.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {(resource.tags || []).slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/content/${resource.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ContentHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  const topics = [...new Set(resources.flatMap((r) => r.tags || []))];
  const types = [...new Set(resources.map((r) => r.type))];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === 'all' || resource.type === typeFilter;
    const matchesTopic =
      topicFilter === 'all' ||
      (resource.tags && resource.tags.includes(topicFilter));
    return matchesSearch && matchesType && matchesTopic;
  });

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            MindExp Content Hub
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            Explore articles, videos, podcasts, and guides curated by experts
            and the community to support your well-being journey.
          </p>
        </div>
      </section>

      {/* 2. Filtering and Sorting Section */}
      <section className="container mx-auto p-4 md:p-6 sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search resources..."
            className="md:max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-2 md:flex gap-4">
            <Select onValueChange={setTypeFilter} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setTopicFilter} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* 3. Content Grid */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ContentCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold">No resources found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
