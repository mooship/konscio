import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { describe, expect, it, vi } from "vitest";
import { GET } from "../../src/pages/search.json.ts";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const createContext = (): APIContext => ({}) as APIContext;

describe("search.json", () => {
  it("should return search data for dispatches", async () => {
    const mockPosts = [
      {
        data: {
          title: "Test Post 1",
          datePublished: new Date("2023-01-01"),
          excerpt: "Test excerpt 1",
          categories: ["category1"],
        },
        slug: "test-post-1",
      },
      {
        data: {
          title: "Test Post 2",
          datePublished: new Date("2023-01-02"),
          description: "Test description 2",
          categories: ["category2"],
        },
        slug: "test-post-2",
      },
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual([
      {
        title: "Test Post 2",
        url: "/dispatches/test-post-2",
        datePublished: "2023-01-02T00:00:00.000Z",
        excerpt: "Test description 2",
        categories: ["category2"],
      },
      {
        title: "Test Post 1",
        url: "/dispatches/test-post-1",
        datePublished: "2023-01-01T00:00:00.000Z",
        excerpt: "Test excerpt 1",
        categories: ["category1"],
      },
    ]);
  });

  it("should handle posts without excerpt or description", async () => {
    const mockPosts = [
      {
        data: {
          title: "Untitled Post",
          datePublished: new Date("2023-01-01"),
        },
        slug: "untitled-post",
      },
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    const data = await response.json();
    expect(data[0].excerpt).toBe("");
    expect(data[0].categories).toEqual([]);
  });

  it("should sort posts by date descending", async () => {
    const mockPosts = [
      {
        data: {
          title: "Older Post",
          datePublished: new Date("2023-01-01"),
          excerpt: "Old",
        },
        slug: "older",
      },
      {
        data: {
          title: "Newer Post",
          datePublished: new Date("2023-01-03"),
          excerpt: "New",
        },
        slug: "newer",
      },
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    const data = await response.json();
    expect(data[0].title).toBe("Newer Post");
    expect(data[1].title).toBe("Older Post");
  });

  it("should handle posts with invalid dates", async () => {
    const mockPosts = [
      {
        data: {
          title: "Invalid Date Post",
          datePublished: "invalid-date",
          excerpt: "Invalid",
        },
        slug: "invalid-date",
      },
      {
        data: {
          title: "Valid Post",
          datePublished: "2023-01-02T00:00:00.000Z",
          excerpt: "Valid",
        },
        slug: "valid",
      },
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.length).toBe(1);
    expect(data[0].title).toBe("Valid Post");
  });

  it("should handle getCollection throwing an error", async () => {
    (getCollection as any).mockRejectedValue(new Error("Collection error"));

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it("should handle posts with no data property", async () => {
    const mockPosts = [
      {
        slug: "no-data-post",
      } as any,
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it("should filter out draft posts and future dated posts", async () => {
    const mockPosts = [
      {
        data: {
          title: "Past Post",
          datePublished: new Date("2023-01-01"),
          excerpt: "Past excerpt",
          draft: false,
        },
        slug: "past-post",
      },
      {
        data: {
          title: "Future Post",
          datePublished: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          excerpt: "Future excerpt",
          draft: false,
        },
        slug: "future-post",
      },
      {
        data: {
          title: "Draft Post",
          datePublished: new Date("2023-01-01"),
          excerpt: "Draft excerpt",
          draft: true,
        },
        slug: "draft-post",
      },
    ];

    (getCollection as any).mockResolvedValue(mockPosts);

    const response = await GET(createContext());
    const data = await response.json();
    expect(data.length).toBe(1);
    expect(data[0].title).toBe("Past Post");
  });
});
