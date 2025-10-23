
'use client';

import { useUser, useFirestore, useDoc, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  year: z.string().min(4, 'Year is required'),
});

const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const socialLinksSchema = z.object({
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const profileSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(100),
  bio: z.string().max(1000).optional(),
  location: z.string().optional(),
  skills: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  careerInterest: z.string().optional(),
  education: z.array(educationSchema).optional(),
  portfolioItems: z.array(portfolioItemSchema).optional(),
  socialLinks: socialLinksSchema.optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education',
  });

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
    control,
    name: 'portfolioItems',
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/career/me/edit');
    }
  }, [user, isUserLoading, router]);
  
  useEffect(() => {
    if (userProfile) {
      reset({
        headline: userProfile.headline || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        skills: userProfile.skills?.join(', ') || '',
        careerInterest: userProfile.careerInterest || '',
        education: userProfile.education || [],
        portfolioItems: userProfile.portfolioItems || [],
        socialLinks: userProfile.socialLinks || {},
      });
    }
  }, [userProfile, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!userDocRef) return;
    
    // Merge with existing non-form data to avoid overwriting
    const updatedData = {
        ...userProfile,
        ...data,
    };
    
    try {
        await setDocumentNonBlocking(userDocRef, updatedData, { merge: true });
        toast({
            title: 'Profile Updated',
            description: 'Your career profile has been saved successfully.',
        });
        if(user?.displayName) {
          router.push(`/career/${user.displayName}`);
        } else {
          router.push('/career');
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to save your profile. Please try again.',
            variant: 'destructive',
        });
        console.error("Profile update error:", error);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Loading your profile...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Redirect is handled by useEffect
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Your Career Profile</CardTitle>
          <CardDescription>
            This information will be visible to others on the platform. Fill it out to connect with peers and opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl">Basic Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input id="headline" {...register('headline')} placeholder="e.g., Aspiring Software Engineer | Psychology Student" />
                    {errors.headline && <p className="text-sm text-destructive">{errors.headline.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register('location')} placeholder="e.g., San Francisco, CA" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea id="bio" {...register('bio')} placeholder="Tell us a bit about yourself, your passions, and what you're looking for." rows={5} />
                </div>
            </div>

            {/* Skills & Interests */}
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl">Skills & Interests</h3>
                <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input id="skills" {...register('skills')} placeholder="e.g., React, Python, User Research, Public Speaking" />
                    <p className="text-sm text-muted-foreground">Separate skills with a comma.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="careerInterest">Career Interests</Label>
                    <Input id="careerInterest" {...register('careerInterest')} placeholder="e.g., Internships in FinTech, UX Research roles" />
                </div>
            </div>

            {/* Education */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-headline text-xl">Education</h3>
              {educationFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border p-2 rounded-md relative">
                  <Input {...register(`education.${index}.institution`)} placeholder="Institution" className="md:col-span-2" />
                  <Input {...register(`education.${index}.degree`)} placeholder="Degree" />
                  <Input {...register(`education.${index}.year`)} placeholder="Year" />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendEducation({ institution: '', degree: '', field: '', year: '' })}>
                <PlusCircle className="mr-2" /> Add Education
              </Button>
            </div>

             {/* Portfolio */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-headline text-xl">Portfolio</h3>
              {portfolioFields.map((field, index) => (
                <div key={field.id} className="space-y-2 border p-3 rounded-md relative">
                   <Input {...register(`portfolioItems.${index}.title`)} placeholder="Project Title" />
                   <Textarea {...register(`portfolioItems.${index}.description`)} placeholder="Short project description..." rows={2} />
                   <Input {...register(`portfolioItems.${index}.projectUrl`)} placeholder="Project URL (e.g., GitHub, Live Demo)" />
                   <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removePortfolio(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendPortfolio({ title: '', description: '', projectUrl: '' })}>
                <PlusCircle className="mr-2" /> Add Portfolio Item
              </Button>
            </div>

            {/* Social Links */}
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl">Social Links</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/in/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input id="github" {...register('socialLinks.github')} placeholder="https://github.com/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input id="twitter" {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="portfolio">Personal Portfolio</Label>
                        <Input id="portfolio" {...register('socialLinks.portfolio')} placeholder="https://your-site.com" />
                    </div>
                 </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
