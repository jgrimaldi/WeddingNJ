import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessCode?: string,
      invitation?: Invitation | null
    } & DefaultSession['user']
  }

  interface User {
    accessCode?: string
    invitation?: Invitation | null
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessCode?: string
  }
}
