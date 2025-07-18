import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: 'WebForger - SuperAdmin'
}

export default function Home() {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Developer working on laptop"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">WebForger</h1>
            <p className="py-6">
              Create high quality websites in minutes, with customizable UI and functions.
            </p>
            <Link href='/companies' className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </>
  );
}
