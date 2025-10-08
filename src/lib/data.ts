import { subDays, format } from 'date-fns';
import type { User, Post, Channel, Resource, Event, Professional } from './types';

const now = new Date();

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://picsum.photos/seed/101/40/40', isAnonymous: false, university: 'State University' },
  { id: 'user-2', name: 'Student Helper', avatarUrl: 'https://picsum.photos/seed/102/40/40', isAnonymous: true },
  { id: 'user-3', name: 'Jamie Smith', avatarUrl: 'https://picsum.photos/seed/103/40/40', isAnonymous: false, university: 'Tech Institute' },
  { id: 'user-4', name: 'Anonymous Panda', avatarUrl: 'https://picsum.photos/seed/104/40/40', isAnonymous: true },
];

export const channels: Channel[] = [
  { id: 'academics', name: 'Academics', description: 'Discussions about courses, study tips, and exams.', postCount: 125 },
  { id: 'homesickness', name: 'Homesickness', description: 'Share your feelings and get support from peers.', postCount: 42 },
  { id: 'relationships', name: 'Relationships', description: 'Talk about friends, family, and romantic relationships.', postCount: 88 },
  { id: 'mental-health', name: 'Mental Health', description: 'A safe space to discuss mental wellness challenges.', postCount: 231 },
  { id: 'career-dev', name: 'Career Development', description: 'Internships, job hunting, and career advice.', postCount: 76 },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    channelId: 'academics',
    title: 'Struggling with Quantum Physics',
    author: users[0],
    content: 'Has anyone else found the latest problem set for PHYS 401 incredibly difficult? I\'m completely lost on the section about quantum entanglement. Any study groups forming or advice would be greatly appreciated.',
    createdAt: format(subDays(now, 1), 'MMMM d, yyyy'),
    isFlagged: false,
    replies: [
      {
        id: 'reply-1-1',
        author: users[2],
        content: 'I\'m in the same boat! I spent all weekend on it and barely made any progress. A study group sounds like a great idea.',
        createdAt: format(subDays(now, 1), 'MMMM d, yyyy'),
        replies: [
           { id: 'reply-1-1-1', author: users[0], content: 'Okay, let\'s set one up. How does Wednesday evening work for everyone?', createdAt: format(subDays(now, 0), 'MMMM d, yyyy') }
        ]
      },
       { id: 'reply-1-2', author: users[1], content: 'I took that class last semester. The key is to really understand the superposition principle before moving on. I can share some notes if that helps.', createdAt: format(subDays(now, 0), 'MMMM d, yyyy') },
    ],
  },
  {
    id: 'post-2',
    channelId: 'homesickness',
    title: 'Feeling really down and alone',
    author: users[3],
    content: 'This is my first year away from home and it\'s hitting me harder than I thought. I miss my family and friends so much it hurts. Does it get any easier?',
    createdAt: format(subDays(now, 2), 'MMMM d, yyyy'),
    isFlagged: true,
    flagReason: "High-risk sentiment detected: 'hurts', 'down and alone'.",
    replies: [],
  },
  {
    id: 'post-3',
    channelId: 'relationships',
    title: 'My roommate and I are not getting along',
    author: users[2],
    content: 'My roommate is a nightmare. They are loud, messy, and never respect my space. I\'ve tried talking to them, but nothing changes. I\'m thinking of reporting them to the RA. This is just not fair, I pay tuition here too!',
    createdAt: format(subDays(now, 5), 'MMMM d, yyyy'),
    isFlagged: true,
    flagReason: "Potential conflict: 'nightmare', 'reporting them'. Contains personal frustration.",
    replies: [],
  }
];

export const resources: Resource[] = [
    { id: 'res-1', title: 'Managing Stress and Anxiety', type: 'Article', topic: 'Mental Health', language: 'English', rating: 4.8, imageUrl: 'https://picsum.photos/seed/202/400/225', imageHint: 'reading book', description: 'An in-depth article on cognitive-behavioral techniques to manage academic stress.', comments: [], author: 'Dr. Evelyn Reed', publicationDate: 'Oct 2025', tags: ['Mental Health', 'Academics'] },
    { id: 'res-2', title: 'Beginner\'s Guide to Mindfulness', type: 'Video', topic: 'Mental Health', language: 'English', rating: 4.9, imageUrl: 'https://picsum.photos/seed/201/400/225', imageHint: 'laptop video', description: 'A guided video session on mindfulness meditation for students.', comments: [], author: 'Priya Sharma', publicationDate: 'Sep 2025', tags: ['Mental Health', 'Wellness'] },
    { id: 'res-3', title: 'The Science of Procrastination', type: 'Podcast', topic: 'Academics', language: 'English', rating: 4.6, imageUrl: 'https://picsum.photos/seed/203/400/225', imageHint: 'microphone podcast', description: 'Listen to experts discuss why we procrastinate and how to overcome it.', comments: [], author: 'Dr. Kenji Tanaka', publicationDate: 'Sep 2025', tags: ['Academics', 'Productivity'] },
    { id: 'res-4', title: 'Navigating University Life', type: 'Guide', topic: 'Homesickness', language: 'Spanish', universityAffiliation: 'State University', rating: 4.7, imageUrl: 'https://picsum.photos/seed/204/400/225', imageHint: 'campus guide', description: 'A comprehensive guide for new students at State University.', comments: [], author: 'Community Mentors', publicationDate: 'Aug 2025', tags: ['Student Life', 'Homesickness'] }
];

export const events: Event[] = [
    { id: 'evt-1', title: 'Webinar: Coping with Exam Anxiety', description: 'Join Dr. Emily Carter for a session on strategies to handle exam-related stress.', date: '2024-10-15T14:00:00Z', type: 'Webinar', isArchived: false, rsvpCount: 128, imageUrl: 'https://picsum.photos/seed/301/400/200', imageHint: 'online meeting' },
    { id: 'evt-2', title: 'Live Q&A: Healthy Relationships', description: 'Ask our panel of experts your questions about maintaining healthy relationships in college.', date: '2024-10-22T18:00:00Z', type: 'Live Q&A', isArchived: false, rsvpCount: 94, imageUrl: 'https://picsum.photos/seed/302/400/200', imageHint: 'group discussion' },
    { id: 'evt-3', title: 'Workshop: Resume Building', description: 'A hands-on workshop to help you craft the perfect resume for your dream job.', date: '2024-09-28T11:00:00Z', type: 'Workshop', isArchived: true, rsvpCount: 250, imageUrl: 'https://picsum.photos/seed/303/400/200', imageHint: 'writing resume' }
];

export const professionals: Professional[] = [
    { id: 'prof-1', name: 'Dr. Sarah Johnson, PhD', title: 'Clinical Psychologist', isVerified: true, specialty: 'Anxiety & Depression', university: 'State University', profileUrl: 'https://picsum.photos/seed/401/100/100', imageHint: 'doctor smiling' },
    { id: 'prof-2', name: 'Dr. Michael Chen, MD', title: 'Psychiatrist', isVerified: true, specialty: 'ADHD & Mood Disorders', university: 'Tech Institute', profileUrl: 'https://picsum.photos/seed/402/100/100', imageHint: 'therapist portrait' },
    { id: 'prof-3', name: 'Dr. Lena Rodriguez, PhD', title: 'Researcher', isVerified: false, specialty: 'Student Mental Wellness', university: 'Metro College', profileUrl: 'https://picsum.photos/seed/403/100/100', imageHint: 'researcher lab' }
];
