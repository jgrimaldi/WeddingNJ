import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import type { GetServerSidePropsContext } from 'next'

export async function getServerAuthSession(
  ctx: {
    req: GetServerSidePropsContext['req']
    res: GetServerSidePropsContext['res']
  }
) {
  return await getServerSession(ctx.req, ctx.res, authOptions)
}

export function validateAccessCode(code: string): boolean {
  const validCodes = process.env.VALID_CODES?.split(',') || ['SECRET123']
  return validCodes.includes(code)
}
