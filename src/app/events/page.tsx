import Image from 'next/image';
import { events } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Video } from 'lucide-react';
import { format } from 'date-fns';
import { AppSidebar } from '@/components/layout/sidebar';

export default function EventsPage() {
  const upcomingEvents = events.filter(e => !e.isArchived);
  const archivedEvents = events.filter(e => e.isArchived);

  return (
    <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Events</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                Join our live events or catch up on past recordings.
                </p>
            </header>
            
            <section className="mb-12">
                <h2 className="font-headline text-3xl font-bold mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                    <Card key={event.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative h-40 w-full">
                            <Image src={event.imageUrl} alt={event.title} fill style={{objectFit: 'cover'}} data-ai-hint={event.imageHint} />
                        </div>
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                        <Badge className="w-fit mb-2">{event.type}</Badge>
                        <CardTitle className="font-headline text-xl flex-grow">{event.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm text-muted-foreground flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> {format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        </CardDescription>
                        <CardFooter className="p-0 pt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            {event.rsvpCount} attending
                        </div>
                        <Button>RSVP</Button>
                        </CardFooter>
                    </div>
                    </Card>
                ))}
                </div>
            </section>

            <section>
                <h2 className="font-headline text-3xl font-bold mb-6">Past Recordings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedEvents.map((event) => (
                    <Card key={event.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative h-40 w-full">
                            <Image src={event.imageUrl} alt={event.title} fill style={{objectFit: 'cover'}} data-ai-hint={event.imageHint} />
                        </div>
                    </CardHeader>
                    <div className="p-6 flex flex-col flex-grow">
                        <Badge variant="secondary" className="w-fit mb-2">{event.type}</Badge>
                        <CardTitle className="font-headline text-xl flex-grow">{event.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm text-muted-foreground flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> {format(new Date(event.date), "MMMM d, yyyy")}
                        </CardDescription>
                        <CardFooter className="p-0 pt-4 flex justify-end items-center">
                        <Button variant="secondary">
                            <Video className="mr-2 h-4 w-4"/>
                            Watch Recording
                        </Button>
                        </CardFooter>
                    </div>
                    </Card>
                ))}
                </div>
            </section>
        </div>
    </div>
  );
}
