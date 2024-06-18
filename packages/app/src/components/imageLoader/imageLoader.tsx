import Image, { StaticImageData } from "next/image";

type Props = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
};

export function ImageLoader(props: Props) {
  return (
    <Image
      className={props.className ? props.className : ""}
      src={props.src}
      alt={props.alt}
    />
  );
}
