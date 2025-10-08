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
  type: 'Article' | 'Video' | 'Podcast' | 'Guide';
  topic: string;
  language: string;
  universityAffiliation?: string;
  rating: number;
  imageUrl: string;
  imageHint: string;
  comments: { user: string; comment: string }[];
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
