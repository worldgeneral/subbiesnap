import Link from "next/link";
import NavBar from "./navBar";
import LineLogo from "../subbieSnap/logo/logo";
import { PrimaryButton } from "../buttons/primary/primary";
import { SecondaryButton } from "../buttons/secondary/secondary";

export default function Header() {
  return (
    <>
      <header className="bg-white">
        <div className="col-3 flex mt-5 mb-5">
          <div className="w-1/4">
            <LineLogo />
          </div>
          <div className="items-right mx-5 ml-auto flex justify-evenly">
            <PrimaryButton
              className="m-1"
              link={"/auth/login"}
              buttonText="Login"
            />
            <SecondaryButton
              className="m-1"
              link="/signup"
              buttonText="Signup"
            ></SecondaryButton>
          </div>
        </div>
      </header>
      <NavBar />
    </>
  );
}
