import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Mock validation function - in production, check against database
const validateAccessCode = (code: string): boolean => {
  const validCodes = process.env.VALID_CODES?.split(',') || ['SECRET123']
  return validCodes.includes(code)
}

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

        const isValid = validateAccessCode(credentials.accessCode)
        
        if (isValid) {
          // Return user object - this will be saved in the session
          return {
            id: '1',
            name: 'Authorized User',
            email: null,
            image: null, // Explicitly set to null instead of undefined
            accessCode: credentials.accessCode
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
      // Persist the access code in the token
      if (user) {
        token.accessCode = (user as any).accessCode
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
        accessCode: token.accessCode as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
