import classNames from "classnames";
import Image from "next/image";
import { PropsWithChildren } from "react";

export enum PlayingCardSize {
  sm = 20,
  md = 30,
  lg = 40,
  xl = 50,
}

enum ImageVariant {
  heart = "/images/cardSuites/heart.svg",
  diamond = "/images/cardSuites/diamond.svg",
  club = "/images/cardSuites/club.svg",
  spade = "/images/cardSuites/spade.svg",
}

type Props = PropsWithChildren<{
  className?: string;
  variant: "heart" | "diamond" | "club" | "spade";
  size: PlayingCardSize;
}>;

export function PlayingCard({ children, ...props }: Props) {
  return (
    <div
      className={classNames(
        props.className,
        "relative border-2 rounded-2xl border-black mb-5 aspect-[5/7] bg-gray-50 shadow shadow-black"
      )}
    >
      <div className="absolute inset-0">
        <Image
          className="absolute top-[3%] left-[3%] w-[15%]"
          src={ImageVariant[props.variant]}
          alt={props.variant}
          width={100}
          height={100}
        />
        <Image
          className="w-[80%] opacity-25 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
          src="/images/playingCard/circleCity.svg"
          alt="dark city around a circle"
          width={100}
          height={100}
        />
        <Image
          className=" absolute bottom-[3%] right-[3%] w-[15%] rotate-180"
          src={ImageVariant[props.variant]}
          alt={props.variant}
          width={100}
          height={100}
        />
      </div>
      <div className="relative flex justify-center items-center h-full z-10">
        {children}
      </div>
    </div>
  );
}
