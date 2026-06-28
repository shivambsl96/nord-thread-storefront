import Image from "next/image";
import { getArticles, getBlogs } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blogs | Nord Threads",
  description: "Editorial notes, mindset pieces, and quiet wardrobe stories from Nord Threads."
};

export default async function BlogsPage() {
  const [blogs, articles] = await Promise.all([
    getBlogs({ first: 6, articlesFirst: 3 }),
    getArticles({ first: 12 })
  ]);

  const featuredArticle = articles[0] ?? null;
  const supportingArticles = articles.slice(1);

  return (
    <div className="bg-paper">
      <section className="catalogue-shell soft-pattern border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
            Blogs
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.72fr,0.48fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[0.07em] text-ink sm:text-5xl lg:text-6xl">
                Notes for better days.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/68">
                Short reads from the Nord Threads universe. Mindset, style, and quiet intent.
              </p>
            </div>
            <div className="border border-ink/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Editorial count</p>
              <p className="mt-3 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                {String(articles.length).padStart(2, "0")} live articles
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {featuredArticle ? (
          <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr] lg:items-stretch">
            <ArticleVisual article={featuredArticle} priority />
            <article className="flex flex-col justify-center border-y border-ink/10 py-8 lg:py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                Featured note
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold uppercase leading-tight tracking-[0.07em] text-ink sm:text-4xl">
                {featuredArticle.title}
              </h2>
              <ArticleBody article={featuredArticle} />
            </article>
          </div>
        ) : (
          <EmptyBlogsState blogs={blogs} />
        )}

        {supportingArticles.length ? (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {supportingArticles.map((article) => (
              <article
                key={article.id}
                className="group flex min-h-full flex-col border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <ArticleVisual article={article} compact />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
                    {article.blog?.title || "Journal"}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                    {article.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-ink/65">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ArticleVisual({ article, compact = false, priority = false }) {
  return (
    <div className={`soft-pattern surface-stillness relative overflow-hidden border border-ink/10 ${compact ? "aspect-[4/3]" : "min-h-[340px] lg:min-h-[520px]"}`}>
      {article.image?.url ? (
        <Image
          src={article.image.url}
          alt={article.image.altText || article.title}
          fill
          priority={priority}
          className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.02]"
          unoptimized
        />
      ) : (
        <div className="flex h-full min-h-[260px] items-center justify-center p-8 text-center">
          <p className="max-w-sm font-display text-3xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
            {article.title}
          </p>
        </div>
      )}
    </div>
  );
}

function ArticleBody({ article }) {
  const blocks = splitArticleBlocks(article.content || article.excerpt);

  return (
    <div className="mt-6 max-w-2xl space-y-5 text-base leading-8 text-ink/68">
      {blocks.map((block, index) => (
        <p key={`${block}-${index}`}>{block}</p>
      ))}
    </div>
  );
}

function splitArticleBlocks(text = "") {
  return String(text)
    .split(/\n+/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function EmptyBlogsState({ blogs }) {
  return (
    <div className="border border-dashed border-ink/20 bg-white px-6 py-12">
      <p className="font-display text-3xl font-bold uppercase tracking-[0.08em] text-ink">
        No blog posts yet.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/62">
        Notes will appear here once they are published.
      </p>
      {blogs.length ? (
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-ink/45">
          Connected blogs: {blogs.map((blog) => blog.title).join(" / ")}
        </p>
      ) : null}
    </div>
  );
}
