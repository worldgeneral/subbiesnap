import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "../icons/buttonIcon";

type props = {
  link: string;
  buttonText: string;
  className?: string;
};

export function SecondaryButton(props: props) {
  const buttonClasses =
    " h-10 text-white shadow-inner shadow-md bg-gradient-to-br from-button-secondary-one from-50% to-button-secondary-two to-50% rounded-3xl border-t-2 border-t-indigo-500 inline-block ";
  return (
    <Link
      className={
        props.className ? buttonClasses.concat(props.className) : buttonClasses
      }
      href={props.link}
    >
      <div className="flex items-center h-full">
        <div className="basis-9/12 mx-3 text-center ">{props.buttonText}</div>
        <div className="border-2 rounded-full border-indigo-500 bg-button-secondary-one shadow-inner shadow-sm">
          <ArrowRightIcon />
        </div>
      </div>
    </Link>
  );
}
