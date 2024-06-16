import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "../icons/buttonIcon";

type props = {
  link: string;
  buttonText: string;
};

export function SecondaryButton(props: props) {
  return (
    <Link
      className="w-32 h-10 text-white shadow-inner shadow-md bg-gradient-to-br from-button-secondary-one from-50% to-button-secondary-two to-50% rounded-3xl border-t-2 border-t-indigo-500"
      href={props.link}
    >
      <div className="flex items-center h-full">
        <div className="basis-9/12 text-center ">{props.buttonText}</div>
        <div className="border-2 rounded-full border-indigo-500 bg-button-secondary-one shadow-inner shadow-sm">
          <ArrowRightIcon />
        </div>
      </div>
    </Link>
  );
}
