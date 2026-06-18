import Link from "next/link"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { blogPosts } from "@/lib/blog-posts"
import { format } from "date-fns"

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="blog" />
      <div className="page-container max-w-3xl">
        <PageHeader
          badge="Journal"
          title="Blog & Tips"
          description="Guides on DTF care, fabric choices, and getting the most out of your ORBYT tees."
        />
        <ul className="space-y-4">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block page-card page-card-hover p-6 group"
              >
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
                <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-white/65 text-sm leading-relaxed">{post.excerpt}</p>
                <span className="inline-block mt-4 text-red-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
