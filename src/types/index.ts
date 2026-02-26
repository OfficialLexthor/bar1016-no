export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: string
  name: string
  slug: string
  sort_order: number
  neon_color: NeonColor
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategoryWithItems extends MenuCategory {
  menu_items: MenuItem[]
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  event_type: "karaoke" | "dj" | "tema" | "annet"
  image_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  reservation_type: "bord" | "karaoke"
  message: string | null
  status: "pending" | "confirmed" | "cancelled"
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  url: string
  alt: string | null
  sort_order: number
  created_at: string
}

export interface OpeningHours {
  id: string
  day_of_week: number
  day_name: string
  is_open: boolean
  open_time: string | null
  close_time: string | null
}

export interface Campaign {
  id: string
  title: string
  description: string | null
  image_url: string | null
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export type NeonColor = "cyan" | "pink" | "gold" | "green" | "orange" | "red" | "purple"
