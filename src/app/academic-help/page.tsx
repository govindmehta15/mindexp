
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Book, 
  Clock, 
  Users, 
  BarChart, 
  Bot, 
  Rocket, 
  LifeBuoy, 
  Sparkles 
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { icon: Brain, title: 'Study Focus & Productivity', description: 'Improve concentration and study efficiency.' },
  { icon: Book, title: 'Exam Anxiety & Stress Relief', description: 'Mindfulness audios and breathing tasks.' },
  { icon: Clock, title: 'Time Management Tools', description: 'Schedule builders and prioritization guides.' },
  { icon: Users, title: 'Peer & Mentor Connect', description: 'Ask doubts or connect to academic mentors.' },
  { icon: BarChart, title: 'Academic Assessments', description: 'Self-tests to measure focus, motivation, and anxiety.' },
  { icon: Bot, title: 'AI Study Buddy', description: 'A chatbot that gives real-time academic or emotional support.' },
];

const featuredTools = [
  { title: 'Focus & Concentration Test', description: 'Analyze your focus pattern with a short test.', link: '/assessments/asm2' },
  { title: 'Academic Stress Level Test', description: 'Understand your stress triggers.', link: '/assessments/asm1' },
  { title: 'Study Pattern Analyzer', description: 'Discover your most effective study habits.', link: '/assessments/asm2' },
];

const articles = [
  { title: '5 Ways to Manage Exam Anxiety', category: 'Exam Stress', link: '/content' },
  { title: 'The Pomodoro Technique Explained', category: 'Productivity', link: '/content' },
  { title: 'How to Beat Procrastination', category: 'Motivation', link: '/content' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function AcademicHelpPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="py-20 md:py-32 bg-gradient-to-br from-blue-100 to-purple-100"
      >
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-slate-800 mb-4">
            Academic Help for Students
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 mb-8">
            Find guidance, tools, and support to manage your academic journey mindfully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild><Link href="#ask-help">Get Instant Help</Link></Button>
            <Button size="lg" variant="secondary" asChild><Link href="#tools">Explore Study Tools</Link></Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
              Take a Focus Assessment
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 2. Key Categories Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Your Academic Support System</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover:-translate-y-1 transition-transform">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <cat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-xl">{cat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. Featured Tools / Assessments */}
      <motion.section
        id="tools"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Featured Self-Help Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={tool.link}>Start Now</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Personalized Recommendation Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Your Personalized Next Steps</h2>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground mb-8">
            (Placeholder) Based on your recent activity, here are some resources you might find helpful.
          </p>
          <Card className="max-w-xl mx-auto text-left p-6 bg-primary/10 border-primary/20">
            <CardContent className="p-0">
                <p className="font-semibold text-primary">Last time, your focus score was moderate. Try our ‘Pomodoro Mindful Study’ tool.</p>
                <Button variant="link" className="p-0 mt-2">Go to Pomodoro Tool →</Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* 5. Ask for Help Section */}
      <motion.section
        id="ask-help"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">How can we help you right now?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline">AI Academic Assistant</CardTitle>
                <CardDescription>Get instant answers to your questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Chat with AI</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline">Book a Mentor Session</CardTitle>
                <CardDescription>Connect with an experienced academic mentor.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">Book a Session</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline">Join Student Forum</CardTitle>
                <CardDescription>Discuss with peers in a safe community.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Go to Forum</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* 6. Knowledge Library */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">From Our Knowledge Library</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Link href={article.link} key={index}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardDescription>{article.category}</CardDescription>
                    <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
                <Link href="/content">Explore All Resources</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* 7. Emergency Support */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 bg-red-50"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl font-bold font-headline text-red-800 mb-4">Feeling Overwhelmed?</h2>
          <p className="text-lg max-w-2xl mx-auto text-red-700 mb-6">
            If you're struggling, please reach out. You are not alone. Immediate help is available.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="destructive" size="lg">Talk to a Counselor</Button>
            <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-100">
              <LifeBuoy className="mr-2"/>
              Crisis Resources
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
    