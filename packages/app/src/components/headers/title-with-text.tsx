type Props = {
  title: string;
  text?: string;
};

export default function TileWithText(props: Props) {
  return (
    <div className="grid grid-cols-1 pb-8 text-center">
      <h3 className="mb-4 md:text-[26px] md:leading-normal text-2xl leading-normal font-semibold">
        {props.title}
      </h3>

      <p className="text-slate-400 max-w-xl mx-auto">{props.text}</p>
    </div>
  );
}
