export type MovieStatus = 'watched' | 'watching' | 'planned'

export interface Movie {
  id: number
  name: string
  image?: string
  summary: string
  rating: number
  language: string
  status: MovieStatus
  genres: string[]
  premiered?: string
}