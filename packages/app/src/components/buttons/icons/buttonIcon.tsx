import Image from "next/image";
import arrowRight from "./arrowRight.svg";

export default function ArrowRightIcon() {
  return (
    <Image
      className="h-6 w-6 flex items-center justify-center"
      src={arrowRight}
      alt="button decoration"
    />
  );
}
