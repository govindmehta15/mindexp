
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Briefcase, HeartHandshake, Lightbulb, Users, BarChart3, Check, Globe, GitCommit, BrainCircuit, Bot, Microscope, Group } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  { name: 'Dr. Evelyn Reed', role: 'Founder & CEO', tagline: 'Building human-centered technology for student wellness.', image: 'https://picsum.photos/seed/501/100/100', hint: 'woman smiling' },
  { name: 'Dr. Kenji Tanaka', role: 'Head of Research', tagline: 'Bridging clinical psychology and data-driven insights.', image: 'https://picsum.photos/seed/502/100/100', hint: 'man glasses' },
  { name: 'Priya Sharma', role: 'Community Lead', tagline: 'Fostering safe and supportive spaces for students.', image: 'https://picsum.photos/seed/503/100/100', hint: 'person portrait' },
  { name: 'Marco Diaz', role: 'Lead Engineer', tagline: 'Architecting a scalable and ethical tech ecosystem.', image: 'https://picsum.photos/seed/504/100/100', hint: 'man tech' },
];

const partners = [
  { name: 'IIT Madras', logo: 'IITM' },
  { name: 'Stanford Wellbeing Lab', logo: 'SWL' },
  { name: 'WHO Youth Mental Health Unit', logo: 'WHO' },
  { name: 'Global Brain Initiative', logo: 'GBI' },
  { name: 'Student Minds UK', logo: 'SMUK' },
  { name: 'The Jed Foundation', logo: 'JED' },
];


export default function AboutPage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Banner */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground py-20 md:py-32"
      >
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Our Vision for a Healthier Student World</h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-8">
            At MindExp, we believe that mental wellness is not a privilege — it’s a foundation. Our mission is to build the world’s most inclusive ecosystem for student support — uniting mental health professionals, educators, and innovators to empower every learner across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild><Link href="#team">Meet Our Team</Link></Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild><Link href="/community">Join the Movement</Link></Button>
          </div>
        </div>
      </motion.section>

      {/* 2. The Problem We're Solving */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">The Student Support Gap</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Every year, millions of students face mental, academic, and emotional stress — but most don’t seek help due to <strong className="text-accent">stigma</strong>, <strong className="text-accent">cost</strong>, or lack of <strong className="text-accent">resources</strong>.
              </p>
              <p className="text-lg text-muted-foreground">
                We envision a future where support is <strong className="text-accent">built-in</strong>, not searched for.
              </p>
              <div className="bg-green-100/50 text-green-900 p-6 rounded-lg border border-accent/20 mt-6">
                <BarChart3 className="w-8 h-8 text-accent mb-2" />
                <p className="text-2xl font-bold">78% of students report feeling “emotionally overwhelmed” during their studies.</p>
                <p className="text-lg mt-2">Only 18% receive any professional guidance.</p>
                <p className="text-sm text-right mt-2 italic">(Data: Global Education & Wellness Report, 2023)</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
                <Globe className="text-primary/10 w-64 h-64" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. Our Mission Statement */}
       <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 relative inline-block">
                Our Mission
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%'}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute bottom-0 left-0 h-1 bg-accent"
                />
            </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-muted-foreground mt-6">
            To build a <strong className="text-accent">research-driven</strong>, <strong className="text-accent">AI-powered</strong>, and <strong className="text-accent">human-centered</strong> ecosystem that helps students access emotional, academic, and social support at every stage of their learning journey.
          </p>
        </div>
      </motion.section>

      {/* 4. Our Vision for the Future */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-16">Our Vision for the Future</h2>
          <div className="relative border-l-2 border-primary/50 ml-6 md:ml-0">
            {[
              { year: '2025', vision: 'Launch global community for students & experts.' },
              { year: '2026', vision: 'Release self-assessment and early detection tools.' },
              { year: '2027', vision: 'Build AI-driven mental wellness assistant integrated with universities.' },
              { year: '2028', vision: 'Establish research & innovation network across 100+ institutions.' },
              { year: '2030', vision: 'Make holistic student support a standard in education systems.' },
            ].map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-10 ml-10"
              >
                <span className="absolute flex items-center justify-center w-12 h-12 bg-primary rounded-full -left-6 ring-8 ring-background text-primary-foreground font-bold">
                    <GitCommit />
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">{item.year}</h3>
                <p className="text-base font-normal text-muted-foreground">{item.vision}</p>
              </motion.div>
            ))}
          </div>
           <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/community">Join us on this journey</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 5. What Makes MindExp Different */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Our Approach — Science, Empathy, and Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Microscope, title: 'Research-Driven', text: 'Partnering with psychologists, universities, and data scientists to create validated tools.', link: '/research' },
              { icon: Group, title: 'Community-Led', text: 'Students co-create solutions through feedback, content, and participation.', link: '/community' },
              { icon: Bot, title: 'Technology-Enabled', text: 'Ethical AI models for mood detection, personalization, and digital self-help.', link: '/research' },
            ].map(card => (
              <Card key={card.title} className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <CardHeader className="items-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <card.icon className="w-8 h-8 text-primary" />
                    </div>
                  <CardTitle className="font-headline pt-4">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.text}</p>
                  <Button variant="link" asChild className="mt-4">
                    <Link href={card.link}>Learn More →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 6. The People Behind MindExp */}
      <motion.section 
        id="team"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {teamMembers.map(member => (
              <div key={member.name} className="flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4 border-4 border-primary/50">
                  <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg font-headline">{member.name}</h3>
                <p className="text-primary text-sm font-semibold">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-1">{member.tagline}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline">
              <Link href="/community">Want to collaborate with us? <span className="ml-2">🤝</span></Link>
          </Button>
        </div>
      </motion.section>

      {/* 7. Global Research & Partnerships */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Global Research & Partnerships</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            We collaborate with global universities, medical researchers, and startups to study student well-being and co-develop digital tools.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
            {partners.map(p => (
                <div key={p.name} className="flex items-center gap-2 text-muted-foreground font-semibold text-lg grayscale hover:grayscale-0 transition-all">
                    {p.logo}
                </div>
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild>
              <Link href="/research#collaborate">Partner with us</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 9. Sustainability & Ethics */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Our Commitment to Privacy, Ethics, and Sustainability</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <Card className="border-t-4 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Check className="text-primary"/> Privacy First
                    </CardTitle>
                </CardHeader>
                <CardContent>No sensitive data shared without consent.</CardContent>
             </Card>
              <Card className="border-t-4 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Check className="text-primary"/> Ethical AI
                    </CardTitle>
                </CardHeader>
                <CardContent>Transparent models and explainable assessments.</CardContent>
             </Card>
              <Card className="border-t-4 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Check className="text-primary"/> Sustainable Impact
                    </CardTitle>
                </CardHeader>
                <CardContent>Mental wellness + environmental awareness in all initiatives.</CardContent>
             </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="link" asChild>
              <Link href="/privacy">Read Our Ethics Policy →</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 10. Call-to-Action (Bottom Banner) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        className="py-20 bg-gradient-to-r from-accent to-primary"
      >
        <div className="container mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">We’re shaping the next generation of student wellness and innovation.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/community">Join Our Community</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/community">Collaborate with Us</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
