import 'server-only'
import { auth } from '@clerk/nextjs/server'

export async function getWorkspaceId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthenticated: no Clerk user in request context')
  return userId
}
