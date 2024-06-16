import Link from "next/link";
import ArrowRightIcon from "../icons/buttonIcon";

type props = {
  link: string;
  buttonText: string;
};

export function PrimaryButton(props: props) {
  return (
    <Link
      className="w-32 h-10 text-white shadow-inner shadow-md bg-gradient-to-br from-button-primary-one from-50% to-button-primary-two to-50% rounded-3xl border-t-2 border-t-button-primary-two"
      href={props.link}
    >
      <div className="flex items-center h-full">
        <div className="basis-9/12 text-center">{props.buttonText}</div>
        <div className="border-2 rounded-full bg-button-primary-one border-slate-800 shadow-inner shadow-sm">
          <ArrowRightIcon />
        </div>
      </div>
    </Link>
  );
}
