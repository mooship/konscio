import type { APIContext } from "astro";
import { config } from "../config";
import { slugifyPath } from "./slugify";
import { withBase } from "./url";

export interface FeedItem {
  title: string;
  pubDate: Date;
  description: string;
  content?: string;
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
  compiledContent?: () => string | Promise<string>;
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function escapeXml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function resolveSiteUrl(context: APIContext): string {
  if (context.site) {
    return new URL(context.site).toString().replace(/\/$/, "");
  }
  return config.siteUrl.replace(/\/$/, "");
}

export async function processPost(path: string, post: unknown): Promise<FeedItem | null> {
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

  const slug = slugifyPath(path);
  const content = (await postData.compiledContent?.()) || undefined;

  return {
    title: title || "Untitled",
    pubDate: date,
    description: excerpt || description || "",
    content,
    link: withBase(`dispatches/${slug}`),
  };
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const posts = import.meta.glob<PostModule>("../content/dispatches/*.{md,mdx}", { eager: true });

  const items = await Promise.all(
    Object.entries(posts).map(([path, post]) => processPost(path, post))
  );

  return items
    .filter((item): item is FeedItem => item !== null)
    .toSorted((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
