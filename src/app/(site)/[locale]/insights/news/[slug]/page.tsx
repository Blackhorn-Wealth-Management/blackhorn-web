import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { fetchBlogPostBySlug, fetchRelatedBlogPosts } from '@/lib/sanity/fetch'
import { urlFor } from '@/lib/sanity/image'
import { localized, localizedBlocks } from '@/lib/i18n-utils'

const CATEGORY_KEYS: Record<string, string> = {
  'market-commentary': 'marketCommentary',
  'company-news': 'companyNews',
  'investment-insights': 'investmentInsights',
  'event-recap': 'eventRecap',
  'industry-update': 'industryUpdate',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function estimateReadTime(body: unknown[] | undefined): number {
  if (!body) return 3
  const text = body
    .filter((b: unknown) => (b as { _type: string })._type === 'block')
    .map((b: unknown) =>
      ((b as { children?: { text?: string }[] }).children || [])
        .map((c) => c.text || '')
        .join('')
    )
    .join(' ')
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | Blackhorn Wealth Management`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.publishDate,
      ...(post.coverImageUrl && { images: [post.coverImageUrl] }),
    },
  }
}

// Portable Text components for rich rendering
const portableTextComponents = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-10">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            width={1200}
            height={675}
            className="w-full"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center font-sans text-xs text-light-text-secondary">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-12 font-serif text-3xl font-light text-light-text">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 font-serif text-2xl font-light text-light-text">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-6 font-sans text-lg font-light leading-relaxed text-light-text-secondary">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 border-l-2 border-gold pl-6 font-serif text-xl italic leading-relaxed text-light-text-secondary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-light-text">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string }
      children?: React.ReactNode
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold underline decoration-gold/30 transition-colors duration-300 hover:text-gold-light"
      >
        {children}
      </a>
    ),
  },
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const t = await getTranslations('blog')
  const ti = await getTranslations('insights')
  const locale = await getLocale()
  const bodyContent = localizedBlocks(post, 'body', locale) as PortableTextBlock[] | undefined
  const readTime = estimateReadTime(bodyContent)
  const relatedPosts = post.category
    ? await fetchRelatedBlogPosts(post.category, slug)
    : []

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Insights', href: '/insights' },
          { name: ti('sectionNews'), href: '/insights/news' },
          { name: localized(post, 'title', locale), href: `/insights/news/${slug}` },
        ]}
      />
      <main className="min-h-screen bg-white">
        {/* Hero / Cover Image */}
        {/* <section className="relative pb-0 pt-24">
          {post.coverImageUrl ? (
            <div className="relative h-[50vh] min-h-[400px] w-full md:h-[60vh]">
              <Image
                src={post.coverImageUrl}
                alt={post.coverImageAlt || localized(post, 'title', locale)}
                fill
                className="object-cover object-[center_20%]"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/30" />
            </div>
          ) : (
            <div className="h-24" />
          )}
        </section> */}

        {/* Hero photo — full-bleed, sits below fixed navbar */}
        {/*
        {post.coverImageUrl ? (
          <section className="relative pt-24">
            <div className="relative h-[45vh] min-h-[340px] w-full md:h-[55vh]">
              <Image
                src={post.coverImageUrl}
                alt={post.coverImageAlt || localized(post, 'title', locale)}
                fill
                className="object-cover object-[center_20%]"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
            </div>
          </section>
        ) : (
          <div className="h-24 bg-light-bg" />
        )}
        */}

        <div className="h-24 bg-light-bg" />
        {/* Article Header */}
        <section className={`${post.coverImageUrl ? 'relative z-10' : ''} py-10`}>
          <div className="mx-auto max-w-3xl px-6">
            <FadeIn>
              {/* Back link */}
              <Link
                href="/insights/news"
                className="mb-8 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold transition-colors duration-300 hover:text-gold-light"
              >
                &larr; {t('backToNews')}
              </Link>

              {/* Category & Date */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {post.category && (
                  <span className="bg-gold/10 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-gold">
                    {t(CATEGORY_KEYS[post.category] || 'allPosts')}
                  </span>
                )}
                <span className="font-sans text-xs text-muted">
                  {formatDate(post.publishDate)}
                </span>
                <span className="text-muted/40">&middot;</span>
                <span className="font-sans text-xs text-muted">
                  {readTime} {t('minRead')}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl font-light leading-tight text-light-text md:text-4xl lg:text-5xl">
                {localized(post, 'title', locale)}
              </h1>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4 border-b border-gold/8 pb-8">
                {post.author?.photoUrl && (
                  <Image
                    src={post.author.photoUrl}
                    alt={localized(post.author, 'name', locale)}
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-sans text-sm font-medium text-light">
                    {localized(post.author, 'name', locale) || 'Blackhorn Team'}
                  </p>
                  {(post.author?.role || post.author?.role_zh) && (
                    <p className="font-sans text-xs text-muted">
                      {localized(post.author, 'role', locale)}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Article Body */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-6">
            <FadeIn delay={0.1}>
              <div className="prose-custom">
                {bodyContent && (
                  <PortableText
                    value={bodyContent}
                    components={portableTextComponents}
                  />
                )}
              </div>
            </FadeIn>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t border-gold/8 pt-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-gold/10 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gold/6 bg-white-section py-16">
            <div className="mx-auto max-w-7xl px-6">
              <FadeIn>
                <h2 className="mb-10 font-serif text-2xl font-light text-light-text">
                  {t('relatedPosts')}
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((related, i) => (
                  <FadeIn key={related._id} delay={i * 0.1}>
                    <Link
                      href={`/insights/news/${related.slug.current}`}
                      className="group flex flex-col border-[0.5px] border-gold/8 bg-white-card transition-all duration-[450ms] hover:border-gold/15 hover:bg-gold/[0.03]"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {related.coverImageUrl ? (
                          <Image
                            src={related.coverImageUrl}
                            alt={localized(related, 'title', locale)}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-whit-700">
                            <span className="text-2xl text-gold/20">BH</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        {related.category && (
                          <span className="font-sans text-[10px] uppercase tracking-widest text-gold">
                            {t(CATEGORY_KEYS[related.category] || 'allPosts')}
                          </span>
                        )}
                        <h3 className="mt-2 font-serif text-lg font-light leading-snug text-light-text transition-colors duration-300 group-hover:text-gold line-clamp-2">
                          {localized(related, 'title', locale)}
                        </h3>
                        <span className="mt-3 block font-sans text-xs text-muted">
                          {formatDate(related.publishDate)}
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContactCTA />
      </main>
    </>
  )
}
