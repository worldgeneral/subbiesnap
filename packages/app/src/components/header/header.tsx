import Link from "next/link";
import NavBar from "./navBar";
import LineLogo from "../subbieSnap/logo/logo";
import { Button } from "../buttons/main/button";

export default function Header() {
  return (
    <>
      <header className="bg-white">
        <div className="col-3 flex mt-5 mb-5">
          <div className="w-1/4">
            <LineLogo />
          </div>
          <div className="items-right mx-5 ml-auto flex justify-evenly">
            <Button
              variation="primary"
              className="m-1"
              link={"/auth/login"}
              buttonText="Login"
            />
            <Button
              variation="secondary"
              className="m-1"
              link="/signup"
              buttonText="Signup"
            />
          </div>
        </div>
      </header>
      <NavBar />
    </>
  );
}
