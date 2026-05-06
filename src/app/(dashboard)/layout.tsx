import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.emailAddresses[0]?.emailAddress ||
    'User'

  const userInitials =
    (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '') ||
    user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
    'U'

  const workspaceName = user.firstName ? `${user.firstName}'s Workspace` : 'My Workspace'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F7F5FB' }}>
      <Sidebar
        workspaceName={workspaceName}
        userName={userName}
        userImageUrl={user.imageUrl ?? null}
        userInitials={userInitials.toUpperCase()}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-8" style={{ color: '#1A1240' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
