import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">WebForger</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href={'/companies'}>Companies</Link></li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Settings</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
