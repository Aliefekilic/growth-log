export interface Profile {
  id: string;
  displayName: string;
  publicSlug: string;
  title?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  linkedInUrl?: string | null;
  isPublic: boolean;
}

export type UpdateProfileRequest = Omit<Profile, 'id' | 'publicSlug'>;
