import Link from 'next/link'
import LogoutButton from './auth/LogoutButton'

export default function Navbar() {
    return <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <Link href={'/'} className="font-extrabold text-xl">WebForger</Link>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
                <li><Link href={'/dashboard'} className="font-semibold">Dashboard</Link></li>
                <li><LogoutButton /></li>
                {/* <li>
              <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Settings</a></li>
                </ul>
              </details>
            </li> */}
            </ul>
        </div>
    </div>
}
