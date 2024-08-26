export const ErrorMessages = ({
  errors,
}: Record<"errors", string[] | undefined>) =>
  errors ? (
    <ul>
      {errors.map((err, index) => (
        <li key={index}>{err}</li>
      ))}
    </ul>
  ) : null;
