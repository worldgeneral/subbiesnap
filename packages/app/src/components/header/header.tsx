import Link from "next/link";
import NavBar from "./navBar";
import LineLogo from "../subbieSnap/logo/logo";
import { PrimaryButton } from "../buttons/primary/primary";
import { SecondaryButton } from "../buttons/secondary/secondary";

export default function Header() {
  return (
    <>
      <header className="h-32 col-3 mt-5 flex">
        <div className="w-1/4">
          <LineLogo />
        </div>
        <div className="items-right mx-5 ml-auto flex justify-evenly">
          <PrimaryButton link={"/auth/login"} buttonText="Login" />
          <SecondaryButton link="/signup" buttonText="Signup"></SecondaryButton>
        </div>
      </header>
      <NavBar />
    </>
  );
}
