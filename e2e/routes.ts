export const NAV_ROUTES = [
  { path: '/overview', key: 'overview' },
  { path: '/agenda', key: 'agenda' },
  { path: '/seating', key: 'seating' },
  { path: '/gallery', key: 'gallery' },
  { path: '/location', key: 'location' },
  { path: '/about', key: 'about' },
  { path: '/register', key: 'register' },
  { path: '/photo-booth', key: 'photoBooth' },
] as const

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'th', label: 'ไทย' },
  { code: 'cn', label: '中文' },
  { code: 'jp', label: '日本語' },
] as const
