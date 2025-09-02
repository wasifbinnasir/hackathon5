'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PageHeader from '../components/PageHeader'

const links = [
  { href: '/profile/personal', label: 'Personal Information' },
  { href: '/profile/cars', label: 'My Cars' },
  { href: '/profile/bids', label: 'My Bids' },
  { href: '/profile/wishlist', label: 'Wishlist' },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
       <PageHeader title="My Profile" />
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Left Drawer */}
        <aside className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Profile</h2>
          <nav className="space-y-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md font-medium transition 
                  ${pathname === link.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Right Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
