import { User as NextAuthUser } from "next-auth";

// Extend the NextAuth User type to include the id field
export interface SessionUser extends NextAuthUser {
  id: string;
  email: string;
}

// Extend the NextAuth Session type
export interface ExtendedSession {
  user?: SessionUser;
  expires: string;
} 