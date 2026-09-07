export interface BlogPost {
  id: string;
  developerProfileId: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  contentMarkdown: string;
  isPublished: boolean;
}

export interface UpdateBlogPostInput {
  title: string;
  contentMarkdown: string;
  isPublished: boolean;
}
