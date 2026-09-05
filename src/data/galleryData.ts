export type GalleryCategory = 'all' | 'prewedding' | 'proposal' | 'moments'

export type GalleryItem = {
  id: string
  title: string
  category: 'prewedding' | 'proposal' | 'moments'
  categoryLabel: string
  src: string
  location: string
  date: string
  story: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'The Botanical Vows',
    category: 'prewedding',
    categoryLabel: 'Pre-Wedding',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    location: 'Nai Lert Park Heritage Home, Bangkok',
    date: 'November 2026',
    story: 'Surrounded by lush heritage rain trees and soft morning sunlight. Parima designed her own botanical veil pattern.',
    aspectRatio: 'portrait',
  },
  {
    id: 'photo-2',
    title: 'Golden Sunset in Chiang Mai',
    category: 'proposal',
    categoryLabel: 'The Proposal',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    location: 'Mon Jam Viewpoint, Chiang Mai',
    date: 'December 2024',
    story: 'At 1,400 meters above sea level right as the sun dipped behind the mountain range, Jinkawin got down on one knee.',
    aspectRatio: 'landscape',
  },
  {
    id: 'photo-3',
    title: 'Parima (The Bride)',
    category: 'prewedding',
    categoryLabel: 'Pre-Wedding',
    src: '/bride.jpg',
    location: 'Studio Bloom, Bangkok',
    date: 'January 2027',
    story: 'A serene bridal portrait wearing her tailored ivory silk gown with handcrafted floral lace detailing.',
    aspectRatio: 'portrait',
  },
  {
    id: 'photo-4',
    title: 'Autumn in Arashiyama',
    category: 'moments',
    categoryLabel: 'Moments & Trips',
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    location: 'Kyoto, Japan',
    date: 'November 2023',
    story: 'Walking through golden maple leaves alongside the Katsura River. The trip where we knew we would spend our lives together.',
    aspectRatio: 'landscape',
  },
  {
    id: 'photo-5',
    title: 'Jinkawin (The Groom)',
    category: 'prewedding',
    categoryLabel: 'Pre-Wedding',
    src: '/groom.jpg',
    location: 'Studio Bloom, Bangkok',
    date: 'January 2027',
    story: 'Elegance and warmth. Jinkawin in his bespoke terracotta-lined tuxedo.',
    aspectRatio: 'portrait',
  },
  {
    id: 'photo-6',
    title: 'The Coffee Ritual',
    category: 'moments',
    categoryLabel: 'Moments & Trips',
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    location: 'Ari, Bangkok',
    date: 'June 2022',
    story: 'Our favorite Sunday morning tradition: hand-pouring Ethiopian light roast coffee and sketching ideas together.',
    aspectRatio: 'square',
  },
  {
    id: 'photo-7',
    title: 'A Promise Under the Stars',
    category: 'proposal',
    categoryLabel: 'The Proposal',
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    location: 'Chiang Mai Star Gazing Camp',
    date: 'December 2024',
    story: 'Campfire glow, warm cocoa, and the moment she whispered "yes".',
    aspectRatio: 'landscape',
  },
  {
    id: 'photo-8',
    title: 'By the Chao Phraya River',
    category: 'prewedding',
    categoryLabel: 'Pre-Wedding',
    src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    location: 'Old Custom House, Bangkok',
    date: 'October 2026',
    story: 'Capturing the timeless romance of old Bangkok by the gentle river breeze.',
    aspectRatio: 'landscape',
  },
  {
    id: 'photo-9',
    title: 'Laughter in the Rain',
    category: 'moments',
    categoryLabel: 'Moments & Trips',
    src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    location: 'Khao Yai National Park',
    date: 'July 2023',
    story: 'When unexpected monsoon showers caught us mid-hike and turned into our favorite afternoon of spontaneous laughter.',
    aspectRatio: 'portrait',
  },
]
