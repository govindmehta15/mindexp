
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { motion } from 'framer-motion';
import { FileText, Video, BarChart2, Mic, Shield, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { featuredProjects, contentGallery, partners, faqItems } from '@/lib/research-data';
import { collection, serverTimestamp } from 'firebase/firestore';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const iconMapping = {
    PDF: FileText,
    Video: Video,
    Infographic: BarChart2,
    Podcast: Mic,
};

const proposalSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  institution: z.string().min(1, 'Institution is required'),
  proposalTitle: z.string().min(5, 'Title must be at least 5 characters'),
  hypothesis: z.string().min(20, 'Please provide more detail'),
  methodology: z.string().min(20, 'Please provide more detail'),
  link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  consent: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

function ProposalForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    if (!firestore || !user) {
        toast({ title: 'Error', description: 'You must be logged in to submit.', variant: 'destructive' });
        return;
    }
    
    const proposalData = {
        ...data,
        userId: user.uid,
        submittedAt: serverTimestamp(),
        status: 'submitted',
    };

    try {
        await addDocumentNonBlocking(collection(firestore, 'research_proposals'), proposalData);
        toast({
            title: 'Proposal Submitted!',
            description: 'Thank you for your submission. Our team will review it and get back to you.',
        });
        setDialogOpen(false);
    } catch (error) {
        console.error("Error submitting proposal: ", error);
        toast({ title: 'Submission Failed', description: 'An error occurred. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="institution">Institution / Organization</Label>
        <Input id="institution" {...register('institution')} />
        {errors.institution && <p className="text-sm text-destructive">{errors.institution.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="proposalTitle">Proposal Title</Label>
        <Input id="proposalTitle" {...register('proposalTitle')} />
        {errors.proposalTitle && <p className="text-sm text-destructive">{errors.proposalTitle.message}</p>}
      </div>
       <div className="space-y-1">
        <Label htmlFor="hypothesis">Research Question / Hypothesis</Label>
        <Textarea id="hypothesis" rows={3} {...register('hypothesis')} />
        {errors.hypothesis && <p className="text-sm text-destructive">{errors.hypothesis.message}</p>}
      </div>
       <div className="space-y-1">
        <Label htmlFor="methodology">Proposed Methodology</Label>
        <Textarea id="methodology" rows={3} {...register('methodology')} />
        {errors.methodology && <p className="text-sm text-destructive">{errors.methodology.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="link">Link to Supporting Document (Optional)</Label>
        <Input id="link" placeholder="https://docs.google.com/..." {...register('link')} />
        {errors.link && <p className="text-sm text-destructive">{errors.link.message}</p>}
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="consent" {...register('consent')} />
        <div className="grid gap-1.5 leading-none">
            <Label htmlFor="consent" className="text-sm font-normal">
              I agree to the MindExp data privacy and collaboration policy.
            </Label>
            {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Proposal
        </Button>
      </DialogFooter>
    </form>
  );
}


export default function ResearchPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="bg-background text-foreground">

      {/* 1. Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground py-20 md:py-32"
      >
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Research & Innovation at MindExp</h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-8">
            From algorithms to lived stories — we're committed to rigorous, inclusive research that advances student well-being globally. We partner with universities, clinicians, technologists, and students to conduct cutting-edge research. Browse our projects or propose a collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild><Link href="#projects">View Projects</Link></Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Submit Your Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Submit a Research Proposal</DialogTitle>
                  <DialogDescription>
                    We're excited to learn about your ideas. Please provide as much detail as possible.
                  </DialogDescription>
                </DialogHeader>
                {user ? (
                  <ProposalForm setDialogOpen={setDialogOpen} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please log in or sign up to submit a proposal.</p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild><Link href={`/login?redirect=/research`}>Log In</Link></Button>
                      <Button variant="secondary" asChild><Link href={`/signup?redirect=/research`}>Sign Up</Link></Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.section>

      {/* 2. Featured Research Projects */}
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Featured Research Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                  <CardDescription>{project.year} &middot; {project.collaborators}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Image src={project.image} alt={project.title} width={600} height={300} className="rounded-md mb-4 object-cover h-48 w-full" data-ai-hint={project.imageHint} />
                  <p className="text-muted-foreground mb-4">{project.overview}</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {project.findings.map((finding, i) => <li key={i}>{finding}</li>)}
                  </ul>
                </CardContent>
                <CardFooter className="flex-wrap gap-2">
                    <div className="flex gap-2 items-center mr-4">
                        {project.formats.map((format, i) => {
                            const Icon = iconMapping[format as keyof typeof iconMapping];
                            return Icon ? <Icon key={i} className="w-5 h-5 text-muted-foreground" /> : null;
                        })}
                    </div>
                    <Button asChild>
                        <Link href={project.link} target="_blank" rel="noopener noreferrer">Read PDF</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* 3. Content Types Gallery */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Explore Our Research Content</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mx-auto max-w-2xl mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PDF"><FileText className="mr-2"/>Articles</TabsTrigger>
              <TabsTrigger value="Video"><Video className="mr-2"/>Videos</TabsTrigger>
              <TabsTrigger value="Infographic"><BarChart2 className="mr-2"/>Infographics</TabsTrigger>
              <TabsTrigger value="Podcast"><Mic className="mr-2"/>Podcasts</TabsTrigger>
            </TabsList>
            
            {Object.keys(contentGallery).map(category => (
                 <TabsContent key={category} value="all">
                     <div className="grid md:grid-cols-3 gap-6">
                        {contentGallery[category as keyof typeof contentGallery].map((item, index) => {
                             const Icon = iconMapping[item.type as keyof typeof iconMapping];
                            return(
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="p-0">
                                <Image src={item.thumbnail} alt={item.title} width={400} height={200} className="w-full h-40 object-cover" data-ai-hint={item.imageHint}/>
                                </CardHeader>
                                <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    {Icon && <Icon className="w-4 h-4" />}
                                    <span>{item.type}</span>
                                </div>
                                <h3 className="font-semibold font-headline">{item.title}</h3>
                                </CardContent>
                            </Card>
                        )})}
                     </div>
                 </TabsContent>
            ))}

            {Object.keys(contentGallery).map(category => (
                 <TabsContent key={category} value={category}>
                     <div className="grid md:grid-cols-3 gap-6">
                        {contentGallery[category as keyof typeof contentGallery].map((item, index) => {
                             const Icon = iconMapping[item.type as keyof typeof iconMapping];
                            return(
                            <Card key={index} className="overflow-hidden">
                                <CardHeader className="p-0">
                                    <Image src={item.thumbnail} alt={item.title} width={400} height={200} className="w-full h-40 object-cover" data-ai-hint={item.imageHint}/>
                                </CardHeader>
                                <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    {Icon && <Icon className="w-4 h-4" />}
                                    <span>{item.type}</span>
                                </div>
                                <h3 className="font-semibold font-headline">{item.title}</h3>
                                </CardContent>
                            </Card>
                        )})}
                     </div>
                 </TabsContent>
            ))}
          </Tabs>
        </div>
      </motion.section>

      {/* 4. Call for Collaboration */}
      <motion.section
        id="collaborate"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Collaborate With Us</h2>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground mb-8">
            If you are a researcher, university faculty, clinician, or student with a project idea, data, or expertise, we’d love to hear from you. Together we can co-create tools, run studies, and publish findings that truly change lives.
          </p>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Submit Proposal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Submit a Research Proposal</DialogTitle>
                  <DialogDescription>
                    We're excited to learn about your ideas. Please provide as much detail as possible.
                  </DialogDescription>
                </DialogHeader>
                {user ? (
                  <ProposalForm setDialogOpen={setDialogOpen} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please log in or sign up to submit a proposal.</p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild><Link href={`/login?redirect=/research`}>Log In</Link></Button>
                      <Button variant="secondary" asChild><Link href={`/signup?redirect=/research`}>Sign Up</Link></Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
        </div>
      </motion.section>

      {/* 5. Partners & Ethics */}
       <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Our Partners & Ethical Commitment</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            We are proud to collaborate with leading institutions and uphold the highest standards of ethical research.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 mb-12">
            {partners.map(p => (
                <div key={p.name} className="flex items-center gap-3 text-muted-foreground font-semibold text-xl grayscale hover:grayscale-0 transition-all">
                    {p.name}
                </div>
            ))}
          </div>
          <Card className="max-w-2xl mx-auto text-left border-t-4 border-primary">
            <CardHeader className="flex-row items-center gap-4">
                <Shield className="w-10 h-10 text-primary" />
                <CardTitle className="font-headline">Ethical Research First</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">All our collaborative research is governed by strict IRB protocols, ensuring participant privacy, informed consent, and data security. We are committed to transparency in our methods and findings.</p>
                <Button variant="link" asChild className="p-0 mt-2">
                    <Link href="/privacy">Read Our Ethics Policy →</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* 7. FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-headline text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>
      
      {/* 8. CTA Banner */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        className="py-20 bg-gradient-to-r from-accent to-primary"
      >
        <div className="container mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Let's Research Together.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary">Submit Proposal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Submit a Research Proposal</DialogTitle>
                  <DialogDescription>
                    We're excited to learn about your ideas. Please provide as much detail as possible.
                  </DialogDescription>
                </DialogHeader>
                {user ? (
                  <ProposalForm setDialogOpen={setDialogOpen} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please log in or sign up to submit a proposal.</p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild><Link href={`/login?redirect=/research`}>Log In</Link></Button>
                      <Button variant="secondary" asChild><Link href={`/signup?redirect=/research`}>Sign Up</Link></Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Browse Existing Projects
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
