
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

export const careerProfiles: CareerProfile[] = [
  {
    username: 'govind-mehta',
    fullName: 'Govind Mehta',
    headline: 'Backend Developer | Sustainable Logistics',
    bio: `Aspiring backend developer passionate about building sustainable technology for the future. 
    
Currently exploring applications of machine learning in logistics and supply chain management. My goal is to create efficient, eco-friendly systems.
    
Let's connect if you're interested in sustainable tech, backend systems, or just want to chat about programming!`,
    location: 'Ahmedabad, India',
    education: [
      {
        institution: 'Nirma University',
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        year: '2022-2026',
      },
    ],
    skills: ['Python', 'PHP', 'React', 'Firebase', 'Machine Learning', 'Node.js', 'SQL'],
    careerInterest: 'Backend Developer Internships & Full-time roles in Sustainable Tech.',
    profilePicture: 'https://picsum.photos/seed/govind/400/400',
    bannerUrl: 'https://picsum.photos/seed/gbanner/1000/200',
    resumeUrl: '#',
    socialLinks: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      portfolio: '#',
    },
    portfolioItems: [
      {
        title: 'EV Route Optimization System',
        description: 'A Python-based system that optimizes routes for electric vehicle fleets based on battery life, charging station availability, and real-time weather data.',
        projectUrl: '#',
        image: 'https://picsum.photos/seed/p1/400/200',
        type: 'project',
      },
      {
        title: 'Community Peer-Support Platform',
        description: 'A full-stack application built with React and Firebase to connect students for academic and mental wellness support.',
        projectUrl: '#',
        image: 'https://picsum.photos/seed/p2/400/200',
        type: 'project',
      },
    ],
    connectionsCount: 24,
    isPublic: true,
  },
  {
    username: 'sarah-jones',
    fullName: 'Sarah Jones',
    headline: 'UX/UI Designer | Mental Health Tech',
    bio: 'Passionate about creating intuitive and empathetic user experiences, especially for applications focused on mental well-being. I believe thoughtful design can make digital tools more accessible and impactful.',
    location: 'London, UK',
    education: [
      {
        institution: 'University of the Arts London',
        degree: 'MA User Experience Design',
        field: 'Design',
        year: '2021-2023',
      },
    ],
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Accessibility'],
    careerInterest: 'UX roles in health-tech and purpose-driven startups.',
    profilePicture: 'https://picsum.photos/seed/sarah/400/400',
    bannerUrl: 'https://picsum.photos/seed/sbanner/1000/200',
    resumeUrl: '#',
    socialLinks: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      portfolio: '#',
    },
    portfolioItems: [
      {
        title: 'Mindfulness App Redesign',
        description: 'A case study on redesigning a popular mindfulness app to improve user engagement and reduce onboarding friction.',
        projectUrl: '#',
        image: 'https://picsum.photos/seed/p3/400/200',
        type: 'project',
      },
    ],
    connectionsCount: 88,
    isPublic: true,
  },
   {
    username: 'kenji-tanaka',
    fullName: 'Kenji Tanaka',
    headline: 'Data Scientist | AI in Education',
    bio: 'Fascinated by how data can personalize and improve the learning experience. My work focuses on building recommendation engines and predictive models to support student success.',
    location: 'Tokyo, Japan',
    education: [
      {
        institution: 'University of Tokyo',
        degree: 'M.Sc. in Data Science',
        field: 'Computer Science',
        year: '2020-2022',
      },
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'SQL', 'Data Visualization'],
    careerInterest: 'Data Scientist roles in Ed-Tech companies.',
    profilePicture: 'https://picsum.photos/seed/kenji/400/400',
    bannerUrl: 'https://picsum.photos/seed/kbanner/1000/200',
    resumeUrl: '#',
    socialLinks: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      portfolio: '#',
    },
    portfolioItems: [
       {
        title: 'Student At-Risk Prediction Model',
        description: 'Developed a machine learning model to identify students at risk of falling behind, achieving 85% accuracy.',
        projectUrl: '#',
        image: 'https://picsum.photos/seed/p4/400/200',
        type: 'project',
      },
    ],
    connectionsCount: 120,
    isPublic: true,
  },
];
