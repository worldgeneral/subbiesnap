import Link from "next/link";
import NavBar from "./navBar";
import LineLogo from "../subbieSnap/logo/logo";

export default function Header() {
  return (
    <>
      <header className="h-32 col-3 mt-5 flex">
        <div className="w-1/4">
          <LineLogo />
        </div>
        <div className="items-right mx-5 ml-auto">
          <Link className="mx-4 " href="/auth/login">
            login
          </Link>
          <Link className=" mx-4" href="/auth/signup">
            signup
          </Link>
        </div>
      </header>
      <NavBar />
    </>
  );
}
