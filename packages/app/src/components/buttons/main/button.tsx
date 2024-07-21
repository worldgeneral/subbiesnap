import Link from "next/link";
import ArrowRightIcon from "../icons/buttonIcon";
import classNames from "classnames";

type props = {
  link: string;
  buttonText: string;
  variation: "primary" | "secondary";
  className?: string;
};

const variant = {
  primary: {
    bg_color:
      "bg-gradient-to-br from-button-primary-one from-50% to-button-primary-two to-50% border-y-button-primary-two",
    icon_color: "bg-button-primary-one",
    icon_border_color: "border-slate-800",
  },
  secondary: {
    bg_color:
      "bg-gradient-to-br from-button-secondary-one from-50% to-button-secondary-two to-50% border-y-indigo-500",
    icon_color: "bg-button-secondary-one",
    icon_border_color: "border-indigo-500",
  },
};

export function Button(props: props) {
  return (
    <div>
      <Link
        className={classNames(
          "h-10 text-white  shadow-md  rounded-3xl border-y-2  inline-block p-1.5",
          props.className,
          variant[props.variation].bg_color
        )}
        href={props.link}
      >
        <div className="flex items-center ">
          <div className=" mx-3 text-center">{props.buttonText}</div>
          <div
            className={classNames(
              " border-2 rounded-full shadow-inner shadow-sm w-[26px] h-[26px] flex items-center justify-center",
              variant[props.variation].icon_border_color,
              variant[props.variation].icon_color
            )}
          >
            <ArrowRightIcon />
          </div>
        </div>
      </Link>
    </div>
  );
}
