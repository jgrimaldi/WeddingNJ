import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import type { GetServerSidePropsContext } from 'next'

// Special admin code for the bride & groom (Nathalia & Jorge)
export const ADMIN_CODE = process.env.ADMIN_CODE

export async function getServerAuthSession(
  ctx: {
    req: GetServerSidePropsContext['req']
    res: GetServerSidePropsContext['res']
  }
) {
  return await getServerSession(ctx.req, ctx.res, authOptions)
}

export function isAdminCode(code: string): boolean {
  return code === ADMIN_CODE
}

export async function validateAccessCode(code: string): Promise<boolean> {
  const validCodes = process.env.VALID_CODES?.split(',') || ['SECRET123']
  await new Promise(resolve => setTimeout(resolve, 2000));

  return validCodes.includes(code) || isAdminCode(code)
}
