import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-center text-white bg-slate-950 sticky top-0 z-50">
      <div className="justify-center w-10/12 flex items-center p-2">
        <div className="h-3/4 w-0.5 bg-white"></div>
        <Link className="mx-5 text-2xl grow text-center" href="/">
          Home
        </Link>
        <div className="h-3/4 w-0.5 bg-white"></div>
        <Link className="mx-5 text-2xl grow text-center" href="/jobs">
          Jobs
        </Link>
        <div className="h-3/4 w-0.5 bg-white"></div>
        <Link className="mx-5 text-2xl grow text-center" href="/companies">
          Companies
        </Link>
        <div className="h-3/4 w-0.5 bg-white"></div>
        <Link className="mx-5 text-2xl grow text-center" href="/contractors">
          Contractors
        </Link>
        <div className="h-3/4 w-0.5 bg-white"></div>
        <Link className="mx-5 text-2xl grow text-center" href="/about">
          About Us
        </Link>
        <div className="h-3/4 w-0.5 bg-white"></div>
      </div>
    </nav>
  );
}
