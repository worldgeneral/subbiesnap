import classNames from "classnames";
import Image from "next/image";

type Props = {
  className?: string;
  step: string;
  heading: string;
  text: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function Card1(props: Props) {
  return (
    <div
      className={classNames(
        "w-fit bg-gray-50 border-l-4 border-l-red-600 border border-gray-400 shadow-md p-5 flex justify-between rounded-md items-center",
        props.className
      )}
    >
      <div className="">
        <h2 className="text-xl mb-2 border w-fit px-1 rounded-md uppercase tracking-tight font-medium">
          step {props.step}
        </h2>
        <h3 className="text-2xl font-bold mb-2">{props.heading}</h3>
        <p className="text-lg ">{props.text}</p>
      </div>
      <div className="ml-5 flex justify-center w-[90px] h-[90px] rounded-full border border-gray-400 shadow-md">
        <Image
          className=""
          src={props.image.src}
          alt={props.image.alt}
          height={props.image.height}
          width={props.image.width}
        />
      </div>
    </div>
  );
}
