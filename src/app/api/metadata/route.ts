import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

// Simple metadata fetcher - fetches Open Graph and meta tags from URLs
// For production, you might want to use a service or more robust scraping
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract metadata using regex (simple but effective for most cases)
    const getMetaContent = (property: string): string | null => {
      // Try Open Graph
      const ogMatch = html.match(
        new RegExp(
          `<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        )
      );
      if (ogMatch) return ogMatch[1];

      // Try reverse order (content before property)
      const ogMatchReverse = html.match(
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["']`,
          "i"
        )
      );
      if (ogMatchReverse) return ogMatchReverse[1];

      // Try name attribute
      const nameMatch = html.match(
        new RegExp(
          `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        )
      );
      if (nameMatch) return nameMatch[1];

      // Try reverse order for name
      const nameMatchReverse = html.match(
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`,
          "i"
        )
      );
      if (nameMatchReverse) return nameMatchReverse[1];

      return null;
    };

    // Get title
    let title = getMetaContent("title");
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;
    }

    // Get description
    let description = getMetaContent("description");

    // Get favicon
    let favicon = null;
    const faviconMatch = html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i
    );
    if (faviconMatch) {
      favicon = faviconMatch[1];
      // Make relative URLs absolute
      if (favicon.startsWith("/")) {
        favicon = `${parsedUrl.protocol}//${parsedUrl.host}${favicon}`;
      } else if (!favicon.startsWith("http")) {
        favicon = `${parsedUrl.protocol}//${parsedUrl.host}/${favicon}`;
      }
    } else {
      // Default favicon location
      favicon = `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
    }

    // Detect category based on URL or content
    let category = "other";
    const urlLower = url.toLowerCase();
    const titleLower = (title || "").toLowerCase();

    if (
      urlLower.includes("youtube.com") ||
      urlLower.includes("youtu.be") ||
      urlLower.includes("vimeo.com") ||
      urlLower.includes("video")
    ) {
      category = "video";
    } else if (
      urlLower.includes("podcast") ||
      urlLower.includes("spotify.com/episode") ||
      urlLower.includes("anchor.fm") ||
      titleLower.includes("podcast")
    ) {
      category = "podcast";
    } else if (
      urlLower.includes("arxiv.org") ||
      urlLower.includes("paper") ||
      urlLower.includes("research") ||
      titleLower.includes("paper")
    ) {
      category = "paper";
    } else if (
      urlLower.includes("course") ||
      urlLower.includes("udemy") ||
      urlLower.includes("coursera") ||
      urlLower.includes("learn")
    ) {
      category = "course";
    } else if (
      urlLower.includes("blog") ||
      urlLower.includes("medium.com") ||
      urlLower.includes("dev.to") ||
      urlLower.includes("hashnode")
    ) {
      category = "blog";
    }

    // Clean up HTML entities
    const decodeHtmlEntities = (text: string) => {
      return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
    };

    return NextResponse.json({
      title: title ? decodeHtmlEntities(title) : parsedUrl.hostname,
      description: description ? decodeHtmlEntities(description) : null,
      favicon,
      category,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
