"use client";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Error from "@/components/error/error";
import ConfirmEmail from "@/components/confirmEmail/confirmEmail";
import { useSignup } from "./useSignup";

const ErrorMessages = ({ errors }: Record<"errors", string[] | undefined>) =>
  errors ? (
    <ul>
      {errors.map((err, index) => (
        <li key={index}>{err}</li>
      ))}
    </ul>
  ) : null;

export default function SignUp() {
  const {
    queryClient,
    mutation,
    user,
    formData,
    errors,
    showPassword,
    setShowPassword,
    onSubmission,
    onChange,
  } = useSignup();

  if (mutation.error) {
    return <Error error={mutation.error.message} />;
  }

  if (mutation.data) {
    return (
      <ConfirmEmail
        email={user!.email}
        firstName={user!.firstName}
        secondName={user!.secondName}
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1>Sign up for SubbieSnap</h1>
        <div className="grid col-1">
          <div>
            <input
              name="email"
              value={formData.email}
              placeholder="Enter your email here"
              className={errors?.email?._errors.length ? "bg-red-600" : ""}
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.email?._errors} />
          </div>
          <div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Enter your password here"
              className={errors?.password?._errors.length ? "bg-red-600" : ""}
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.password?._errors} />
          </div>
          <div>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              placeholder="Confirm your password here"
              className={
                errors?.confirmPassword?._errors.length ? "bg-red-600" : ""
              }
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.confirmPassword?._errors} />
          </div>
          <input
            type="button"
            value="show password"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
          <div>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              placeholder="First name"
              className={errors?.firstName?._errors.length ? "bg-red-600" : ""}
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.firstName?._errors} />
          </div>
          <div>
            <input
              name="secondName"
              type="text"
              value={formData.secondName}
              placeholder="Second name"
              className={errors?.secondName?._errors.length ? "bg-red-600" : ""}
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.secondName?._errors} />
          </div>

          <input type="button" value="submit" onClick={() => onSubmission()} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
