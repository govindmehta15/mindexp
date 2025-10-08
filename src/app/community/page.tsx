
'use client';

import {
  Users,
  MessageCircle,
  BookOpen,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Brain,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const features = [
  {
    icon: HeartHandshake,
    title: 'Peer Circles',
    description: 'Connect with students facing similar academic or emotional challenges. Build small, safe discussion circles moderated by trained volunteers.',
  },
  {
    icon: Users,
    title: 'Talk to a Professional',
    description: 'Access verified mental health professionals for early advice or structured sessions (coming soon).',
  },
  {
    icon: BookOpen,
    title: 'Learning & Growth Spaces',
    description: 'Join groups based on your interests — mental wellness, academic growth, productivity, creativity, etc.',
  },
  {
    icon: Globe,
    title: 'Global Research Participation',
    description: 'Take part in research studies and projects designed to improve student support systems.',
  },
];

const circles = [
    { title: "Focus & Study Balance", description: "Share strategies for managing study fatigue.", members: 128, tags: ["#wellness", "#focus"] },
    { title: "Anxiety & Mindfulness", description: "Learn daily habits for emotional balance.", members: 245, tags: ["#wellness", "#mindfulness"] },
    { title: "Career & Confidence", description: "Talk about self-doubt, interviews, and finding purpose.", members: 98, tags: ["#career", "#confidence"] },
    { title: "Open Talks", description: "A safe space for open sharing with peers.", members: 312, tags: ["#support", "#general"] }
];

const events = [
    { title: "Mindfulness for Students", date: "October 15, 2025", type: "Online", image: "https://picsum.photos/seed/ev1/400/200", hint: "person meditating" },
    { title: "Panel: Future of Mental Health Tech", date: "November 2025", type: "Hybrid", image: "https://picsum.photos/seed/ev2/400/200", hint: "tech panel" },
    { title: "Student Research Exchange", date: "December 2025", type: "Global online", image: "https://picsum.photos/seed/ev3/400/200", hint: "virtual conference" },
];

const mentors = [
    { name: "Dr. Anya Sharma", role: "Clinical Psychologist", country: "IN", image: "https://picsum.photos/seed/m1/100/100", hint: "woman doctor" },
    { name: "Leo Chen", role: "Student Ambassador", country: "CA", image: "https://picsum.photos/seed/m2/100/100", hint: "male student" },
    { name: "Dr. Ben Carter", role: "Wellness Researcher", country: "UK", image: "https://picsum.photos/seed/m3/100/100", hint: "male researcher" },
    { name: "Sofia Reyes", role: "Community Mentor", country: "US", image: "https://picsum.photos/seed/m4/100/100", hint: "female mentor" },
];

const testimonials = [
    { quote: "I found my accountability partner here — we motivate each other every week.", author: "Javier, Spain" },
    { quote: "MindExp gave me a sense of belonging when I was struggling alone.", author: "Hana, Japan" },
    { quote: "Professionals here don’t just guide; they listen.", author: "Chloe, USA" },
];


export default function CommunityPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">A Safe, Global Space for Students</h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Welcome to the MindExp Community — a space where students, professionals, and mentors come together to share, learn, and grow. Because mental health and academic success are not separate journeys — they go hand in hand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/community">
                  <GraduationCap className="mr-2" />
                  Join as Student
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/community">
                  <Brain className="mr-2" />
                  Join as Professional
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Already a member?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image src="https://picsum.photos/seed/community-hero/500/400" alt="Students connecting" width={500} height={400} className="rounded-lg shadow-xl" data-ai-hint="diverse students connecting" />
          </div>
        </div>
      </section>

      {/* 2. What Our Community Offers */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">A Support Ecosystem for Every Student</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline pt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="link" asChild>
              <Link href="/community/circles">See All Circles <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Featured Circles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Join a Circle That Matches You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {circles.map(circle => (
                <Card key={circle.title} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">{circle.title}</CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">{circle.description}</p>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" /> {circle.members} members
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {circle.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button className="w-full">Join Circle</Button>
                    </div>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Events & Webinars */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Join Our Global Events</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                    {events.map((event, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="overflow-hidden">
                            <Image src={event.image} alt={event.title} width={400} height={200} className="w-full h-48 object-cover" data-ai-hint={event.hint} />
                            <CardHeader>
                                <Badge className="w-fit mb-2">{event.type}</Badge>
                                <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" /> {event.date}
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
            </Carousel>
           <div className="text-center mt-12">
            <Button asChild>
              <Link href="/events">See Upcoming Events <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Meet Our Mentors */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Guided by Experts, Powered by Students</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Our mentors and professionals bring years of experience in psychology, wellness, and student development. You can connect, learn, and even collaborate on research.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {mentors.map(mentor => (
              <div key={mentor.name} className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4 border-4 border-accent">
                  <AvatarImage src={mentor.image} alt={mentor.name} data-ai-hint={mentor.hint} />
                  <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg font-headline">{mentor.name}</h3>
                <p className="text-primary text-sm font-semibold">{mentor.role}</p>
                <p className="text-muted-foreground text-sm mt-1">from {mentor.country}</p>
                 <Button variant="outline" size="sm" className="mt-4">Connect</Button>
              </div>
            ))}
          </div>
          <Button asChild variant="secondary">
              <Link href="/community">Become a Mentor <Sparkles className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* 8. Testimonials */}
       <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Stories from Our Community</h2>
             <Carousel opts={{ loop: true }} className="max-w-4xl mx-auto">
                <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index}>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                                    <p className="font-semibold text-primary">{testimonial.author}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 md:-left-12" />
                <CarouselNext className="-right-4 md:-right-12" />
             </Carousel>
              <div className="text-center mt-8">
                <Button variant="link" asChild>
                    <Link href="/community/stories">Read more stories →</Link>
                </Button>
              </div>
          </div>
      </section>
      
      {/* 9. Community Guidelines */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">A Safe and Supportive Space</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            We prioritize respect, empathy, and privacy. Every member must follow our community principles to keep this space safe and meaningful.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
             <Card className="border-t-4 border-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                        <HeartHandshake className="text-secondary"/> Respect & Confidentiality
                    </CardTitle>
                </CardHeader>
             </Card>
              <Card className="border-t-4 border-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                        <Sparkles className="text-secondary"/> Evidence-based Guidance
                    </CardTitle>
                </CardHeader>
             </Card>
              <Card className="border-t-4 border-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                        <ShieldCheck className="text-secondary"/> Empathy Over Judgment
                    </CardTitle>
                </CardHeader>
             </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="link" asChild>
              <Link href="/community/guidelines">Read Full Guidelines →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Join the Movement */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
             <div className="container mx-auto text-center text-primary-foreground">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">You don’t have to do it alone.</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of students building a stronger, healthier academic world.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/community">
                            <GraduationCap className="mr-2"/> Join as Student
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                       <Link href="/community">
                            <Brain className="mr-2" /> Join as Professional
                       </Link>
                    </Button>
                     <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                       <Link href="/research#collaborate">
                            <Globe className="mr-2" /> Collaborate on Research
                       </Link>
                    </Button>
                </div>
            </div>
        </section>

    </div>
  );
}
