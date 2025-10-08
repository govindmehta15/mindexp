'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { BrainCircuit, BookOpen, MessageSquare, Heart, Users, Microscope, BookHeart, GraduationCap, Brain } from 'lucide-react';
import React, { useState } from 'react';

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
  { quote: "MindExp helped me understand stress patterns I ignored for months.", author: "Alex, University Student" },
  { quote: "I found a mentor from another country through the community chat.", author: "Priya, Engineering Student" },
  { quote: "The self-assessment tools are private, easy to use, and insightful.", author: "John, Medical Student" },
  { quote: "Being part of a research project was a rewarding experience.", author: "Fatima, PhD Candidate" },
];

const contentHighlights = [
    { title: "How to handle exam anxiety", href: "/content/1" },
    { title: "5-minute breathing routine for focus", href: "/content/2" },
    { title: "Why emotional awareness matters in classrooms", href: "/content/3" },
]

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    // In a real app, you would redirect here:
    // router.push(`/self-assessment?mood=${mood}`);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
          <div className="relative max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Building the world’s first global student support ecosystem.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/90">
              Join MindExp — a safe, smart, and supportive space for every student’s growth, wellness, and innovation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link href="/community">🎓 Join the Student Community</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
                <Link href="/assessments">🧠 Explore Self-Assessment</Link>
              </Button>
            </div>
            <div className="absolute -top-12 -left-12 opacity-30 text-white">
                <BrainCircuit size={48} />
            </div>
            <div className="absolute -top-4 -right-12 opacity-30 text-white">
                <BookOpen size={40} />
            </div>
            <div className="absolute -bottom-12 -left-4 opacity-30 text-white">
                <MessageSquare size={44} />
            </div>
             <div className="absolute -bottom-16 -right-8 opacity-30 text-white">
                <Heart size={48} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Mission */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto text-center px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Why We Exist</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="items-center">
                        <div className="bg-secondary p-4 rounded-full">
                            <BrainCircuit className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl mt-4">Mental Health Matters</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        We aim to make mental wellness accessible and stigma-free for every student.
                    </CardContent>
                </Card>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="items-center">
                         <div className="bg-secondary p-4 rounded-full">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl mt-4">Global Community</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Students, psychologists, and mentors connecting across countries.
                    </CardContent>
                </Card>
                 <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="items-center">
                         <div className="bg-secondary p-4 rounded-full">
                            <Microscope className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl mt-4">Innovation in Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Using technology & research to redefine student well-being.
                    </CardContent>
                </Card>
            </div>
            <Button asChild variant="link" className="mt-12 text-primary">
                <Link href="/about">Read Our Vision →</Link>
            </Button>
        </div>
      </section>

      {/* 3. Explore Ecosystem */}
      <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container mx-auto text-center px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">An ecosystem that grows with you.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((card, index) => (
                <Card key={index} className="group overflow-hidden text-center hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="items-center bg-secondary/40 p-6">
                    <card.icon className="w-12 h-12 text-primary" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="font-headline text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{card.description}</p>
                    <Button asChild variant="link" className="text-primary">
                      <Link href={card.href}>{card.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">What Our Community Says</h2>
            <Carousel opts={{ loop: true }} className="max-w-4xl mx-auto">
                <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full">
                            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                                <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                                <p className="font-bold mt-4 text-sm">{testimonial.author}</p>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="text-center mt-8">
                 <Button asChild variant="link" className="text-primary">
                    <Link href="/community">Read more stories →</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* 5. Research */}
       <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Research that shapes real student lives.</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">🧬 Global Student Mood Tracking Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">In partnership with 12 universities, exploring digital stress patterns.</p>
                <Button>Join Study</Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">🧠 Early Anxiety Intervention Study</CardTitle>
              </Header>
              <CardContent>
                <p className="text-muted-foreground mb-4">Testing new digital tools for early identification of anxiety symptoms in first-year students.</p>
                <Button>Join Study</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Mini-Assessment */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto text-center px-4 max-w-2xl">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">How are you feeling today?</h2>
          <div className="flex justify-center gap-4 md:gap-6 mb-6">
            {['😊', '😐', '😟', '😢', '😡'].map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelection(mood)}
                className={`text-4xl md:text-5xl p-3 rounded-full transition-all duration-200 ${selectedMood === mood ? 'bg-secondary scale-125' : 'hover:scale-110 hover:bg-secondary/50'}`}
              >
                {mood}
              </button>
            ))}
          </div>
          <Button asChild size="lg">
            <Link href={`/self-assessment${selectedMood ? `?mood=${encodeURIComponent(selectedMood)}` : ''}`}>Start My Assessment</Link>
          </Button>
        </div>
      </section>

       {/* 7. Content Highlights */}
       <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Learn, Reflect, Grow.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {contentHighlights.map((item) => (
                 <Card key={item.title} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <h3 className="font-headline text-lg font-bold">{item.title}</h3>
                        <Button asChild variant="link" className="p-0 mt-2 text-primary">
                            <Link href={item.href}>Read more</Link>
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
       <section className="py-20 md:py-28 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto text-center px-4 text-primary-foreground">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">We’re building a movement for students, by students.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/ambassador">Join as Student Ambassador</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/professionals">Join as Psychologist / Research Partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
