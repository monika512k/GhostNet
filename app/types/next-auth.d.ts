// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

// Also extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}