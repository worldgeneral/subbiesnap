import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="justify-center sticky top-0 h-20 flex items-center">
      <Link className="mx-5 text-2xl" href="/">
        Home
      </Link>
      <Link className="mx-5 text-2xl" href="/jobs">
        Jobs
      </Link>
      <Link className="mx-5 text-2xl" href="/companies">
        Companies
      </Link>
      <Link className="mx-5 text-2xl" href="/contractors">
        Contractors
      </Link>
      <Link className="mx-5 text-2xl" href="/about">
        About Us
      </Link>
    </nav>
  );
}
