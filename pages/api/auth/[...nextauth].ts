import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { validateAccessCode } from '@/lib/auth'
import { INVITATIONS_DATA } from '@/lib/invitations-data'
import type { Invitation } from '@/types/invitations';

const getInvitation = (code: string) => {
  return INVITATIONS_DATA[code];
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'AccessCode',
      credentials: {
        accessCode: { 
          label: 'Access Code', 
          type: 'text', 
          placeholder: 'Enter your access code' 
        }
      },
      async authorize(credentials) {
        if (!credentials?.accessCode) {
          throw new Error('Access code is required')
        }
        
        const isValid = await validateAccessCode(credentials.accessCode)
        
        if (isValid) {
          const invitation = getInvitation(credentials.accessCode)
          // Return user object - this will be saved in the session
          return {
            id: '1',
            name: 'Authorized User',
            email: null,
            image: null, // Explicitly set to null instead of undefined
            accessCode: credentials.accessCode,
            invitation: invitation || null
          }
        } else {
          // Return null if authentication fails
          throw new Error('Invalid access code')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the access code and invitation in the token
      if (user) {
        token.accessCode = (user as any).accessCode
        token.invitation = (user as any).invitation || null
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      // Send clean properties to the client
      session.user = {
        name: token.name as string || 'Authorized User',
        email: null,
        image: null,
        accessCode: token.accessCode as string,
        invitation: token.invitation as Invitation | null
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    // Reduce session duration to 2 hours (7200 seconds)
    maxAge: 2 * 60 * 60, // 2 hours in seconds
    // Update session every 30 minutes to keep it fresh if user is active
    updateAge: 30 * 60 // 30 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
