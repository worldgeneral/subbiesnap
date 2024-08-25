type Props = {
  error?: string;
};

export default function Error(props: Props) {
  return (
    <div>
      <h1>{props.error}</h1>
    </div>
  );
}
