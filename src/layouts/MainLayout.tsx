import { Outlet } from 'react-router-dom'
import { PrimaryNavbar } from '../components/PrimaryNavbar'
import { SecondaryNavbar } from '../components/SecondaryNavbar'
import { Footer } from '../components/Footer'

/** Flush with bottom of fixed nav stack (see --nav-stack-height in index.css) */
const MAIN_OFFSET = 'pt-[var(--nav-stack-height)]'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PrimaryNavbar />
      <SecondaryNavbar />
      <main className={`flex-1 ${MAIN_OFFSET}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
