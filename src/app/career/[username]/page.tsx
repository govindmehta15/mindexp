
'use client';

import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { careerProfiles } from '@/lib/career-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
} from 'lucide-react';
import { AppHeader } from '@/components/layout/header';

export default function CareerProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const profile = careerProfiles.find((p) => p.username === username);

  if (!profile) {
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
                <Image
                  src={profile.bannerUrl}
                  alt={`${profile.fullName}'s banner`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="abstract background"
                />
              </div>
              <CardContent className="pt-6 relative">
                <Avatar className="w-32 h-32 absolute -top-16 left-6 border-4 border-background">
                  <AvatarImage src={profile.profilePicture} alt={profile.fullName} data-ai-hint="person portrait" />
                  <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-40 pt-2">
                  <CardTitle className="font-headline text-3xl">{profile.fullName}</CardTitle>
                  <p className="text-lg text-muted-foreground">{profile.headline}</p>
                  <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button><Plus className="mr-2"/>Connect</Button>
                  <Button variant="secondary"><MessageCircle className="mr-2"/>Message</Button>
                  <Button variant="outline">Show Interest</Button>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {profile.portfolioItems.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                       <Image
                        src={item.image}
                        alt={item.title}
                        width={300}
                        height={150}
                        className="rounded-t-lg object-cover w-full h-32"
                        data-ai-hint="project abstract"
                      />
                      <CardTitle className="text-lg font-semibold pt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                      <Button variant="link" asChild className="p-0 mt-2">
                        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">View Project <Github className="ml-2"/></a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu, index) => (
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
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </CardContent>
            </Card>

             {/* Career Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Career Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profile.careerInterest}</p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Linkedin/>LinkedIn</a>
                 <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Github/>GitHub</a>
                 <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><Twitter/>Twitter</a>
                 <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary"><LinkIcon/>Portfolio</a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
