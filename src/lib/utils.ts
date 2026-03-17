export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function calculateReadTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text ? text.split(' ').length : 0
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const CATEGORIES = [
  { label: 'Webflow', slug: 'webflow' },
  { label: 'SEO', slug: 'seo' },
  { label: 'Automatización', slug: 'automatizacion' },
  { label: 'Casos de Éxito', slug: 'casos' },
]

export const PATTERNS = ['dots', 'grid', 'wave', 'circles', 'diagonal']
