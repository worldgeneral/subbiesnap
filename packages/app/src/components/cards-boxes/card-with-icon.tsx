import classNames from "classnames";
import Image from "next/image";

type Props = {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  header: string;
  text: string;
  className?: string;
};

export function CardWithIcon(props: Props) {
  return (
    <div className={classNames("text-center ", props.className)}>
      <Image
        className="inline-block mb-5 justify-self-center"
        src={props.image.src}
        alt={props.image.alt}
        width={props.image.width}
        height={props.image.height}
      />
      <h3 className="font-semibold text-xl mb-5">{props.header}</h3>
      <p className="text-lg ">{props.text}</p>
    </div>
  );
}
