import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../src/pages/atom.xml.ts";

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

  it("should include entries with required Atom fields", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).toContain("<entry>");
    expect(body).toContain("<title>");
    expect(body).toContain("<id>");
    expect(body).toContain("<updated>");
    expect(body).toContain("<summary>");
  });

  it("should escape XML special characters", async () => {
    const context = createContext("https://example.com") as any;
    const response = await GET(context);
    const body = await response.text();

    // Should not contain unescaped ampersands in text content (outside of XML structure)
    expect(body).not.toMatch(/ & /);
  });

  it("should handle context without site URL", async () => {
    const context = createContext() as any;
    const response = await GET(context);
    const body = await response.text();

    expect(body).toContain("http://localhost");
    expect(body).toContain("<feed");
  });
});
