import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              A safer place for student wellbeing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Peer support, clinician-backed resources, and research that works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/community">Join as a student</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/professionals">Are you a professional?</Link>
              </Button>
            </div>
          </div>
           <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/hero/1200/800" 
                alt="Students collaborating"
                fill
                style={{objectFit: 'cover'}}
                data-ai-hint="students collaborating"
                priority
              />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                We provide three core pillars to support student mental wellness in a holistic and effective way.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-headline text-2xl font-bold mb-2">Peer Community</h3>
                    <p className="text-muted-foreground">Connect with fellow students in safe, moderated forums to share experiences and find solidarity.</p>
                </div>
                <div className="p-8 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-headline text-2xl font-bold mb-2">Resource Hub</h3>
                    <p className="text-muted-foreground">Access a library of clinician-backed articles, videos, and tools tailored to student life.</p>
                </div>
                 <div className="p-8 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-headline text-2xl font-bold mb-2">Meaningful Research</h3>
                    <p className="text-muted-foreground">Contribute to and benefit from cutting-edge research to improve mental health outcomes globally.</p>
                </div>
            </div>
        </div>
      </section>
      
      <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto text-center py-16">
               <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
                  Calling clinicians & researchers
                </h2>
                <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-8">
                  Collaborate on global projects to improve student mental health. Publish with us & access anonymized student datasets.
                </p>
                 <Button asChild size="lg" variant="secondary">
                    <Link href="/professionals">Learn More & Partner With Us</Link>
                </Button>
          </div>
      </section>

    </div>
  );
}
