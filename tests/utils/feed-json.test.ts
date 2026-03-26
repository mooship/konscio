import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../src/pages/feed.json.ts";

vi.mock("../../src/config", () => ({
  config: {
    title: "Test Site",
    description: "Test Description",
    author: { name: "Test Author", bio: "Test Bio" },
  },
}));

const createContext = (site?: string): APIContext =>
  ({
    site: site ? new URL(site) : undefined,
  }) as unknown as APIContext;

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

  it("should include items with required JSON Feed fields", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(Array.isArray(feed.items)).toBe(true);
    if (feed.items.length > 0) {
      const item = feed.items[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("summary");
      expect(item).toHaveProperty("date_published");
      expect(item.url).toMatch(/^https:\/\/example\.com\/dispatches\//);
    }
  });

  it("should sort items by date descending", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const feed = await response.json();

    if (feed.items.length > 1) {
      const dates = feed.items.map((item: any) => new Date(item.date_published).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    }
  });

  it("should handle context without site URL", async () => {
    const context = createContext() as any;
    const response = await GET(context);
    const feed = await response.json();

    expect(feed.home_page_url).toBe("http://localhost/");
    expect(feed.feed_url).toBe("http://localhost/feed.json");
  });
});
