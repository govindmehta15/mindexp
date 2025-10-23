
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { careerProfiles } from '@/lib/career-data';
import type { CareerProfile } from '@/lib/career-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus } from 'lucide-react';
import { AppHeader } from '@/components/layout/header';

const ProfileCard = ({ profile }: { profile: CareerProfile }) => {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={profile.profilePicture} alt={profile.fullName} data-ai-hint="person portrait" />
          <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-xl">
            <Link href={`/career/${profile.username}`}>{profile.fullName}</Link>
        </CardTitle>
        <CardDescription className="text-sm">{profile.headline}</CardDescription>
      </CardContent>
      <CardFooter className="flex-grow flex flex-col items-center justify-end p-4 pt-0">
         <div className="flex flex-wrap justify-center gap-1 my-3">
          {profile.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        <Button className="w-full" asChild>
          <Link href={`/career/${profile.username}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CareerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');

  const allSkills = [...new Set(careerProfiles.flatMap((p) => p.skills))];

  const filteredProfiles = careerProfiles.filter((profile) => {
    const matchesSearch =
      profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.headline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      skillFilter === 'all' || profile.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div>
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Explore profiles of talented students, connect with peers, and showcase your own work.
          </p>
           <Button size="lg" asChild>
            <Link href="/career/me/edit">
                <Plus className="mr-2"/>
                Create Your Profile
            </Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto p-4 md:p-6 sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or headline..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setSkillFilter} defaultValue="all">
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {allSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold">No profiles found</h3>
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
