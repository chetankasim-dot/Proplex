import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/proposals(.*)',
  '/ndas(.*)',
  '/quotes(.*)',
  '/contracts(.*)',
  '/tenders(.*)',
  '/analytics(.*)',
  '/settings(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url })
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
