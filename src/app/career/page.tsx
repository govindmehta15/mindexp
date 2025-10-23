
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Search, Plus, Loader2, Eye, Sparkles, Users, HeartHandshake } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

const ProfileCard = ({ profile }: { profile: any }) => {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={profile.profilePicture} alt={profile.displayName} data-ai-hint="person portrait" />
          <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-xl">
            <Link href={`/career/${profile.displayName}`}>{profile.displayName}</Link>
        </CardTitle>
        <CardDescription className="text-sm">{profile.headline}</CardDescription>
      </CardContent>
      <CardFooter className="flex-grow flex flex-col items-center justify-end p-4 pt-0">
         <div className="flex flex-wrap justify-center gap-1 my-3 min-h-[24px]">
          {profile.skills?.slice(0, 3).map((skill: string) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        <Button className="w-full" asChild>
          <Link href={`/career/${profile.displayName}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CareerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const profilesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'users'));
  }, [firestore]);

  const { data: careerProfiles, isLoading: areProfilesLoading } = useCollection(profilesQuery);

  const allSkills = [...new Set(careerProfiles?.flatMap((p) => p.skills || []) || [])];

  const filteredProfiles = careerProfiles?.filter((profile) => {
    const matchesSearch =
      profile.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.headline?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      skillFilter === 'all' || profile.skills?.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });
  
  // Check if the current user has a profile with a headline (a good indicator of a created career profile)
  const currentUserProfile = careerProfiles?.find(p => p.id === user?.uid);
  const userHasProfile = !!currentUserProfile?.headline;

  const getProfileLink = () => {
    if (userHasProfile) {
        return `/career/${currentUserProfile.displayName}`;
    }
    return '/career/me/edit';
  };

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
          {isUserLoading ? (
             <Button size="lg" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
             </Button>
          ) : user ? (
             <Button size="lg" asChild>
                <Link href={getProfileLink()}>
                    {userHasProfile ? <Eye className="mr-2"/> : <Plus className="mr-2"/>}
                    {userHasProfile ? "View My Profile" : "Create Your Profile"}
                </Link>
             </Button>
          ): (
             <Button size="lg" asChild>
                <Link href="/login?redirect=/career/me/edit">
                    <Plus className="mr-2"/>
                    Create Your Profile
                </Link>
             </Button>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">More Than a Profile — A Career Ecosystem for Wellness</h2>
              <p className="text-lg max-w-3xl mx-auto text-muted-foreground mb-12">
                We believe career readiness and mental well-being go hand-in-hand. This space is designed to help you grow with confidence.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3 font-headline">
                              <Sparkles className="w-8 h-8 text-primary"/>
                              Build Your Story
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          Showcase your skills, projects, and personality beyond a traditional resume. Let your unique journey shine.
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3 font-headline">
                              <Users className="w-8 h-8 text-primary"/>
                              Connect with Purpose
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                           Find mentors, collaborators, and peers who share your academic and professional interests in a supportive environment.
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3 font-headline">
                              <HeartHandshake className="w-8 h-8 text-primary"/>
                              Grow with Confidence
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          Tackle imposter syndrome and build self-assurance by connecting with a community that values growth over perfection.
                      </CardContent>
                  </Card>
              </div>
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
       {areProfilesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles && filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
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
       )}
      </main>
    </div>
  );
}
