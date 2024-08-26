import classNames from "classnames";

import { Button } from "../buttons/main/button";

type props = {
  title?: {
    title: string;
    className?: string;
  };
  innerText?: {
    text: string;
    className?: string;
  };
  cardClassName?: string;

  button?: {
    buttonLink: string;
    buttonText: string;
    buttonType: "primary" | "secondary";
  };
};

export function InfoCard(props: props) {
  const cardClassName =
    "flex flex-col justify-center p-8 border-2 border-black rounded-md";
  const titleClassName = "text-5xl m-3";
  const innerTextClassName = "text-xl m-3 ";
  return (
    <div className={classNames(cardClassName, props.cardClassName)}>
      {props.title && (
        <h3 className={classNames(titleClassName, props.title.className)}>
          {props.title?.title}
        </h3>
      )}
      {props.innerText?.text && (
        <p
          className={classNames(innerTextClassName, props.innerText.className)}
        >
          {props.innerText.text}
        </p>
      )}

      {props.button && (
        <Button
          variation={props.button?.buttonType}
          link={props.button.buttonLink}
          buttonText={props.button.buttonText}
        />
      )}
    </div>
  );
}
