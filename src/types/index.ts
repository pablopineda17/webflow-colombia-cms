export interface Post {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  seo_title: string | null
  seo_description: string | null
  excerpt: string | null
  body: string | null
  date: string | null
  read_time: string | null
  hero_image: string | null
  thumbnail: string | null
  category: string | null
  category_slug: string | null
  pattern: string
  published: boolean
}

export type PostFormData = Omit<Post, 'id' | 'created_at' | 'updated_at'>
