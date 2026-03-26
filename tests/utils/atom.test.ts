import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../src/pages/atom.xml.ts";

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
  escapeXml: (str: string) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;"),
  resolveSiteUrl: (ctx: any) =>
    ctx.site ? new URL(ctx.site).toString().replace(/\/$/, "") : "https://theredsoil.co.za",
}));

const createContext = (site?: string): APIContext =>
  ({ site: site ? new URL(site) : undefined }) as unknown as APIContext;

describe("atom.xml", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return valid Atom XML with correct content type", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);

    expect(response.headers.get("Content-Type")).toBe("application/atom+xml; charset=utf-8");

    const body = await response.text();
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(body).toContain("<title>Test Site</title>");
    expect(body).toContain("<subtitle>Test Description</subtitle>");
    expect(body).toContain("<name>Test Author</name>");
  });

  it("should include self link and alternate link", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).toContain('href="https://example.com/atom.xml" rel="self"');
    expect(body).toContain('href="https://example.com/" rel="alternate"');
  });

  it("should include entries with required Atom fields and full content", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).toContain("<entry>");
    expect(body).toContain("<title>First Post</title>");
    expect(body).toContain("<summary>First excerpt</summary>");
    expect(body).toContain('<content type="html">');
    expect(body).toContain("<p>Full first content</p>");
    expect(body).toContain("https://example.com/dispatches/first-post");
  });

  it("should escape XML special characters in title and description", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).not.toMatch(/ & /);
  });

  it("should handle context without site URL", async () => {
    const context = createContext() as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).toContain("https://theredsoil.co.za");
    expect(body).toContain("<feed");
  });
});
