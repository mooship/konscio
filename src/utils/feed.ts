export interface FeedItem {
  title: string;
  pubDate: Date;
  description: string;
  link: string;
}

interface PostFrontmatter {
  title?: string;
  datePublished: string | Date;
  excerpt?: string;
  description?: string;
  draft?: boolean;
}

interface PostModule {
  frontmatter: PostFrontmatter;
  default: unknown;
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function processPost(path: string, post: unknown): FeedItem | null {
  if (!post || typeof post !== "object") {
    return null;
  }

  const postData = post as PostModule;
  if (!postData.frontmatter) {
    return null;
  }

  const { title, datePublished, excerpt, description, draft } = postData.frontmatter;

  if (draft === true) {
    return null;
  }

  const date = new Date(datePublished);
  if (!isValidDate(date) || date.getTime() > Date.now()) {
    return null;
  }

  const slug =
    path
      .split("/")
      .pop()
      ?.replace(/\.(md|mdx)$/, "") || "";

  return {
    title: title || "Untitled",
    pubDate: date,
    description: excerpt || description || "",
    link: `/dispatches/${slug}/`,
  };
}

export function getFeedItems(): FeedItem[] {
  const posts = import.meta.glob<PostModule>("../content/dispatches/*.{md,mdx}", { eager: true });

  return Object.entries(posts)
    .map(([path, post]) => processPost(path, post))
    .filter((item): item is FeedItem => item !== null)
    .toSorted((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
