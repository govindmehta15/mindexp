
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  isAnonymous: boolean;
  university?: string;
};

export type Reply = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  replies?: Reply[];
};

export type Post = {
  id: string;
  title: string;
  channelId: string;
  author: User;
  content: string;
  createdAt: string;
  replies: Reply[];
  isFlagged: boolean;
  flagReason?: string;
};

export type Channel = {
  id: string;
  name: string;
  description: string;
  postCount: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Podcast' | 'Guide' | 'Misc';
  topic: string;
  language: string;
  universityAffiliation?: string;
  rating: number;
  imageUrl: string;
  imageHint: string;
  comments: { user: string; comment: string }[];
  author?: string;
  publicationDate?: string;
  tags?: string[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'Webinar' | 'Live Q&A' | 'Workshop';
  isArchived: boolean;
  rsvpCount: number;
  imageUrl: string;
  imageHint: string;
};

export type Professional = {
  id: string;
  name: string;
  title: string;
  isVerified: boolean;
  specialty: string;
  university: string;
  profileUrl: string;
  imageHint: string;
};

export type Assessment = {
  id: string;
  title: string;
  description: string;
  type: 'MCQ' | 'Video + Quiz' | 'Reading + Essay' | 'Peer Review';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
  status: 'Not Started' | 'In Progress' | 'Completed';
  contentUrls: string[];
};
