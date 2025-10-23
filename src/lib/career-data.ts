// This file is now deprecated in favor of fetching data directly from Firestore.
// It is kept for reference but is no longer used by the application.

export type CareerProfile = {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  skills: string[];
  careerInterest: string;
  profilePicture: string;
  bannerUrl: string;
  resumeUrl: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    portfolio: string;
  };
  portfolioItems: {
    title: string;
    description: string;
    projectUrl: string;
    image: string;
    type: 'project' | 'certificate';
  }[];
  connectionsCount: number;
  isPublic: boolean;
};

export const careerProfiles: CareerProfile[] = [];
