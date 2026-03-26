import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../src/pages/feed.json.ts";

const mockFeedItems = [
  {
    title: "First Post",
    pubDate: new Date("2025-03-01"),
    description: "First excerpt",
    content: "<p>Full first content</p>",
    link: "/dispatches/first-post",
  },
  {
    title: "Second Post",
    pubDate: new Date("2025-02-01"),
    description: "Second excerpt",
    content: "<p>Full second content</p>",
    link: "/dispatches/second-post",
  },
];

vi.mock("../../src/config", () => ({
  config: {
    title: "Test Site",
    description: "Test Description",
    author: { name: "Test Author", bio: "Test Bio" },
    baseUrl: "/",
  },
}));

vi.mock("../../src/utils/feed", () => ({
  getFeedItems: async () => mockFeedItems,
  resolveSiteUrl: (ctx: any) =>
    ctx.site ? new URL(ctx.site).toString().replace(/\/$/, "") : "https://theredsoil.co.za",
}));

const createContext = (site?: string): APIContext =>
  ({ site: site ? new URL(site) : undefined }) as unknown as APIContext;

describe("feed.json", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return valid JSON Feed with correct content type", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);

    expect(response.headers.get("Content-Type")).toBe("application/feed+json; charset=utf-8");

    const feed = await response.json();
    expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(feed.title).toBe("Test Site");
    expect(feed.description).toBe("Test Description");
    expect(feed.language).toBe("en-GB");
  });

  it("should include correct URLs", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(feed.home_page_url).toBe("https://example.com/");
    expect(feed.feed_url).toBe("https://example.com/feed.json");
  });

  it("should include authors", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(feed.authors).toEqual([{ name: "Test Author" }]);
  });

  it("should include items with required JSON Feed fields and full content", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(feed.items).toHaveLength(2);
    const item = feed.items[0];
    expect(item.id).toBe("https://example.com/dispatches/first-post");
    expect(item.url).toBe("https://example.com/dispatches/first-post");
    expect(item.title).toBe("First Post");
    expect(item.summary).toBe("First excerpt");
    expect(item.content_html).toBe("<p>Full first content</p>");
    expect(item.date_published).toBe("2025-03-01T00:00:00.000Z");
  });

  it("should sort items by date descending", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    const dates = feed.items.map((item: any) => new Date(item.date_published).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  it("should handle context without site URL", async () => {
    const context = createContext() as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(feed.home_page_url).toBe("https://theredsoil.co.za/");
    expect(feed.feed_url).toBe("https://theredsoil.co.za/feed.json");
  });
});
