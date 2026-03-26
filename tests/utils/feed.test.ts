import { describe, expect, it } from "vitest";
import { getFeedItems } from "../../src/utils/feed.ts";

describe("getFeedItems", () => {
  it("should return an array of feed items", () => {
    const items = getFeedItems();
    expect(Array.isArray(items)).toBe(true);
  });

  it("should return items with required fields", () => {
    const items = getFeedItems();
    for (const item of items) {
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("pubDate");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("link");
      expect(typeof item.title).toBe("string");
      expect(item.pubDate).toBeInstanceOf(Date);
      expect(typeof item.description).toBe("string");
      expect(item.link).toMatch(/^\/dispatches\//);
    }
  });

  it("should sort items by date descending", () => {
    const items = getFeedItems();
    if (items.length > 1) {
      for (let i = 0; i < items.length - 1; i++) {
        expect(items[i].pubDate.getTime()).toBeGreaterThanOrEqual(items[i + 1].pubDate.getTime());
      }
    }
  });

  it("should not include draft posts", () => {
    const items = getFeedItems();
    for (const item of items) {
      expect(item.title).toBeTruthy();
    }
  });

  it("should not include future-dated posts", () => {
    const items = getFeedItems();
    const now = Date.now();
    for (const item of items) {
      expect(item.pubDate.getTime()).toBeLessThanOrEqual(now);
    }
  });
});
