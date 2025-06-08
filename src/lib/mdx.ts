import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  content: string;
}

// Use Vite's import.meta.glob to get all MDX files
// In production, this will be statically analyzed at build time
const posts = import.meta.glob("../content/blog/*.mdx", {
  as: "raw",
  eager: true,
});

function parseFrontmatter(content: string): {
  data: Record<string, string>;
  content: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, markdownContent] = match;
  const data: Record<string, string> = {};

  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim();
      // Remove quotes if present
      data[key.trim()] = value.replace(/^["']|["']$/g, "");
    }
  });

  return {
    data,
    content: markdownContent.trim(),
  };
}

// Pre-process all posts at build time
const processedPosts = Object.entries(posts)
  .map(([path, content]) => {
    const { data, content: markdownContent } = parseFrontmatter(
      content as string
    );
    const slug =
      path
        .split("/")
        .pop()
        ?.replace(/\.mdx$/, "") || "";

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      author: data.author || "",
      content: markdownContent,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export async function getBlogPosts(): Promise<BlogPost[]> {
  return processedPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return processedPosts.find((post) => post.slug === slug) || null;
}
