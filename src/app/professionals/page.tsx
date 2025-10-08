import Image from 'next/image';
import { professionals } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, School } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppSidebar } from '@/components/layout/sidebar';

export default function ProfessionalsPage() {
  return (
    <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Professionals & Researchers</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                Connect with verified mental health professionals and researchers.
                </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((prof) => (
                <Card key={prof.id} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                        <AvatarImage src={prof.profileUrl} alt={prof.name} data-ai-hint={prof.imageHint} />
                        <AvatarFallback>{prof.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-xl">{prof.name}</CardTitle>
                    <CardDescription className="text-primary">{prof.title}</CardDescription>
                    <Badge variant="secondary" className="mt-4">{prof.specialty}</Badge>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground items-center justify-center p-4 border-t">
                    <div className="flex items-center">
                        <School className="mr-2 h-4 w-4"/>
                        {prof.university}
                    </div>
                    {prof.isVerified && (
                        <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verified Professional
                        </div>
                    )}
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
