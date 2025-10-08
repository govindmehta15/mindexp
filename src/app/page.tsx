'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BrainCircuit, Heart, Users, GraduationCap, Brain, Microscope, BookHeart } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';


const featureCards = [
  { 
    icon: GraduationCap, 
    title: "Community", 
    description: "Connect with peers and experts for emotional & academic support.", 
    cta: "Join Community →",
    href: "/community"
  },
  { 
    icon: Brain, 
    title: "Self-Assessment", 
    description: "Take early mental health and mood checks with professional guidance.", 
    cta: "Start Assessment →",
    href: "/assessments"
  },
  { 
    icon: Microscope, 
    title: "Research Projects", 
    description: "Join global studies with professionals to co-create solutions.", 
    cta: "See Research →",
    href: "/research"
  },
  { 
    icon: BookHeart, 
    title: "Content Hub", 
    description: "Explore stories, podcasts, videos, and guides made for students.",
    cta: "Visit Hub →",
    href: "/content"
  }
];

const testimonials = [
    {
        quote: "MindExp helped me understand stress patterns I ignored for months.",
        author: "Alex, University Student",
    },
    {
        quote: "I found a mentor from another country through the community chat.",
        author: "Priya, Engineering Student",
    },
    {
        quote: "The self-assessment tool was a gentle way to check in with myself.",
        author: "Leo, Art & Design Student",
    },
     {
        quote: "Being part of a research project made me feel like I was making a difference.",
        author: "Samira, Psychology Major",
    }
];

const researchProjects = [
    {
        title: "Global Student Mood Tracking Project",
        summary: "In partnership with 12 universities, exploring digital stress patterns.",
    },
    {
        title: "Impact of Peer Support on Academic Anxiety",
        summary: "A study on the effectiveness of community-based support systems.",
    },
];

const contentHighlights = [
    {
        title: "How to handle exam anxiety",
        category: "Article",
        href: "/resources"
    },
    {
        title: "5-minute breathing routine for focus",
        category: "Video",
        href: "/resources"
    },
    {
        title: "Why emotional awareness matters in classrooms",
        category: "Podcast",
        href: "/resources"
    }
];

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-primary/80 to-accent text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
                Building the world’s first global student support ecosystem.
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
                Join MindExp — a safe, smart, and supportive space for every student’s growth, wellness, and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/community">🎓 Join the Student Community</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/assessments">🧠 Explore Self-Assessment</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* 2. Our Mission */}
      <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why We Exist</h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline">
                              <Heart className="w-8 h-8 text-primary"/>
                              Mental Health Matters
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          We aim to make mental wellness accessible and stigma-free for every student.
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline">
                              <Users className="w-8 h-8 text-primary"/>
                              Global Community
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                           Students, psychologists, and mentors connecting across countries.
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline">
                              <BrainCircuit className="w-8 h-8 text-primary"/>
                              Innovation in Support
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          Using technology & research to redefine student well-being.
                      </CardContent>
                  </Card>
              </div>
              <Button variant="link" asChild className="mt-8 text-lg">
                  <Link href="/about">Read Our Vision →</Link>
              </Button>
          </div>
      </section>

      {/* 3. Explore the Ecosystem */}
      <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">An ecosystem that grows with you.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featureCards.map((card) => (
                      <Card key={card.title} className="flex flex-col text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
                          <CardHeader className="items-center">
                              <div className="bg-primary/10 p-4 rounded-full">
                                  <card.icon className="w-8 h-8 text-primary" />
                              </div>
                              <CardTitle className="font-headline pt-4">{card.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <p className="text-muted-foreground">{card.description}</p>
                          </CardContent>
                          <div className="p-6 pt-0">
                            <Button variant="link" asChild>
                                <Link href={card.href}>{card.cta}</Link>
                            </Button>
                          </div>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Testimonials */}
       <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">What our community is saying</h2>
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
                    <Link href="/community">Read more stories →</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* 5. Research */}
       <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Research that shapes real student lives.</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {researchProjects.map((project, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{project.summary}</p>
                            <Button>Join Study</Button>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </div>
      </section>

      {/* 6. Mini Self-Assessment */}
      <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">How are you feeling today?</h2>
              <div className="flex justify-center gap-4 text-4xl mb-8">
                  {['😊', '😐', '😟', '😢', '😡'].map(mood => (
                      <button 
                          key={mood}
                          onClick={() => setSelectedMood(mood)}
                          className={`p-3 rounded-full transition-all duration-200 ${selectedMood === mood ? 'bg-primary/20 scale-125' : 'hover:bg-muted'}`}
                      >
                          {mood}
                      </button>
                  ))}
              </div>
              <Button size="lg" asChild>
                  <Link href="/assessments">Start My Assessment</Link>
              </Button>
          </div>
      </section>

       {/* 7. Content Highlights */}
        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Learn, Reflect, Grow.</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {contentHighlights.map(item => (
                        <Card key={item.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Badge variant="secondary" className="w-fit">{item.category}</Badge>
                                <CardTitle className="font-headline text-xl pt-2">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="link" asChild className="p-0">
                                    <Link href={item.href}>Read More →</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild>
                        <Link href="/content">Visit the Content Hub</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* 8. Global CTA */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
             <div className="container mx-auto text-center text-primary-foreground">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">We’re building a movement for students, by students.</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary">
                        Join as Student Ambassador
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                       Join as Psychologist / Research Partner
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
