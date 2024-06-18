import Image from "next/image";
import logo from "../../../images/subbieSnapLogo.svg";

export default function LineLogo() {
  return <Image className="h-10" src={logo} alt="Subbie Snap logo" />;
}
