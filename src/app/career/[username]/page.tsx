
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Linkedin,
  Github,
  Twitter,
  Mail,
  Users,
  MessageCircle,
  Plus,
  Loader2,
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where } from 'firebase/firestore';

export default function CareerProfilePage() {
  const params = useParams();
  const username = params.username as string; // We'll use username as display name for lookup
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const firestore = useFirestore();

  const userQuery = useMemoFirebase(() => {
    if (!firestore || !username) return null;
    // Note: Firestore doesn't support case-insensitive queries natively.
    // A more robust solution would use a search service or store a lowercase version of the username.
    // For this implementation, we assume `username` matches `displayName`.
    return query(collection(firestore, 'users'), where('displayName', '==', username));
  }, [firestore, username]);

  const { data: profiles, isLoading: isProfileLoading } = useCollection(userQuery);
  const profile = profiles?.[0];

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to view career profiles.',
        variant: 'destructive',
      });
      router.push(`/login?redirect=/career/${username}`);
    }
  }, [user, isUserLoading, router, toast, username]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    // This part is mainly for preventing render before the redirect effect kicks in.
    return null;
  }

  if (!profile) {
    // This will be called after loading is complete and no profile is found.
    notFound();
  }

  return (
    <div>
      <div className="container mx-auto p-4 md:p-8">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                 {profile.bannerUrl && (
                    <Image
                    src={profile.bannerUrl}
                    alt={`${profile.displayName}'s banner`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="abstract background"
                    />
                 )}
              </div>
              <CardContent className="pt-6 relative">
                <Avatar className="w-32 h-32 absolute -top-16 left-6 border-4 border-background">
                  <AvatarImage src={profile.profilePicture} alt={profile.displayName} data-ai-hint="person portrait" />
                  <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-40 pt-2">
                  <CardTitle className="font-headline text-3xl">{profile.displayName}</CardTitle>
                  <p className="text-lg text-muted-foreground">{profile.headline}</p>
                  <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button><Plus className="mr-2"/>Connect</Button>
                  <Button variant="secondary"><MessageCircle className="mr-2"/>Message</Button>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
             {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Section */}
            {profile.portfolioItems && profile.portfolioItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {profile.portfolioItems.map((item: any, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                         {item.image && <Image
                          src={item.image}
                          alt={item.title}
                          width={300}
                          height={150}
                          className="rounded-t-lg object-cover w-full h-32"
                          data-ai-hint="project abstract"
                        />}
                        <CardTitle className="text-lg font-semibold pt-2">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                        {item.projectUrl && <Button variant="link" asChild className="p-0 mt-2">
                          <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">View Project <Github className="ml-2"/></a>
                        </Button>}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}


            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.education.map((edu: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                          <div className="bg-muted p-3 rounded-lg"><GraduationCap className="text-primary"/></div>
                          <div>
                              <p className="font-semibold">{edu.institution}</p>
                              <p className="text-sm text-muted-foreground">{edu.degree}, {edu.field}</p>
                              <p className="text-sm text-muted-foreground">{edu.year}</p>
                          </div>
                      </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}

             {/* Career Interests */}
            {profile.careerInterest && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Career Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.careerInterest}</p>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {profile.socialLinks && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Linkedin/>LinkedIn</a>}
                   {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Github/>GitHub</a>}
                   {profile.socialLinks.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Twitter/>Twitter</a>}
                   {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><LinkIcon/>Portfolio</a>}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
