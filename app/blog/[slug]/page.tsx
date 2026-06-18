import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { BlogBody } from "@/components/blog-body"
import { getPostBySlug } from "@/lib/blog-posts"
import { format } from "date-fns"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="blog" />
      <article className="page-container max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors mb-8"
        >
          ← All posts
        </Link>
        <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
          {format(new Date(post.date), "MMMM d, yyyy")}
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">{post.title}</h1>
        <div className="page-card p-6 md:p-8">
          <BlogBody content={post.content} />
        </div>
      </article>
    </main>
  )
}
