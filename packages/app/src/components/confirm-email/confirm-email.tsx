type props = {
  firstName: string;
  secondName: string;
  email: string;
};

export default function ConfirmEmail(props: props) {
  return (
    <div>
      <h1>
        Hello{props.firstName} {props.secondName}
      </h1>
      <h2>Please confirm your email</h2>
      <p>{props.email}</p>
    </div>
  );
}
