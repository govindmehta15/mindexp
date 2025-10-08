import Image from 'next/image';
import { resources } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle } from 'lucide-react';
import { AppSidebar } from '@/components/layout/sidebar';

export default function ResourcesPage() {
  const topics = [...new Set(resources.map(r => r.topic))];
  const types = [...new Set(resources.map(r => r.type))];

  return (
    <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Resource Hub</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                Explore articles, videos, podcasts, and guides to support your well-being.
                </p>
            </header>

            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <Input placeholder="Search resources..." className="md:max-w-xs" />
                <div className="grid grid-cols-2 md:flex gap-4">
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Filter by Topic" />
                    </SelectTrigger>
                    <SelectContent>
                    {topics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Filter by Format" />
                    </SelectTrigger>
                    <SelectContent>
                    {types.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                <Card key={resource.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        <Image
                        src={resource.imageUrl}
                        alt={resource.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={resource.imageHint}
                        />
                        <Badge className="absolute top-2 right-2">{resource.type}</Badge>
                    </div>
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                    <CardTitle className="font-headline text-xl mb-2">{resource.title}</CardTitle>
                    <CardDescription className="flex-grow">{resource.description}</CardDescription>
                    <CardFooter className="p-0 pt-4 flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{resource.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{resource.comments.length}</span>
                        </div>
                    </CardFooter>
                    </div>
                </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
