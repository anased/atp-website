import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extending the built-in session types
   */
  interface Session {
    user: {
      id: string;
      isPremium: boolean;
    } & DefaultSession["user"]
  }

  /**
   * Extending the built-in user types
   */
  interface User {
    id: string;
    isPremium?: boolean;
  }
}