"use client";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Error from "@/components/error/error";
import ConfirmEmail from "@/components/confirm-email/confirm-email";
import { Fields, useSignup } from "./use-signup";
import { ErrorMessages } from "@/components/error/error-messages";
import { ZodFormattedError } from "zod";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";

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

  if (mutation.error && !errors) {
    return (
      <Error error={mutation.error.response?.data.errorMessage.toString()} />
    );
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
          {errors?.apiError ? <span>{errors.apiError}</span> : null}
          <div>
            <input
              name="email"
              value={formData.email}
              placeholder="Enter your email here"
              className={errors?.formError?.email?._errors ? "bg-red-600" : ""}
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.formError?.email?._errors} />
          </div>
          <div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Enter your password here"
              className={
                errors?.formError?.password?._errors ? "bg-red-600" : ""
              }
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.formError?.password?._errors} />
          </div>
          <div>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              placeholder="Confirm your password here"
              className={
                errors?.formError?.confirmPassword?._errors ? "bg-red-600" : ""
              }
              onChange={onChange}
            />
            <ErrorMessages
              errors={errors?.formError?.confirmPassword?._errors}
            />
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
              className={
                errors?.formError?.firstName?._errors ? "bg-red-600" : ""
              }
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.formError?.firstName?._errors} />
          </div>
          <div>
            <input
              name="secondName"
              type="text"
              value={formData.secondName}
              placeholder="Second name"
              className={
                errors?.formError?.secondName?._errors ? "bg-red-600" : ""
              }
              onChange={onChange}
            />
            <ErrorMessages errors={errors?.formError?.secondName?._errors} />
          </div>

          <input type="button" value="submit" onClick={() => onSubmission()} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

type Props = {
  queryClient: QueryClient;
  formData: Fields;
  errors: ZodFormattedError<Fields> | undefined;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  onSubmission: () => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function SignUpForm(props: Props) {
  return (
    <HydrationBoundary state={dehydrate(props.queryClient)}>
      <div>
        <h1>Sign up for SubbieSnap</h1>
        <div className="grid col-1">
          <div>
            <input
              name="email"
              value={props.formData.email}
              placeholder="Enter your email here"
              className={props.errors?.email?._errors ? "bg-red-600" : ""}
              onChange={props.onChange}
            />
            <ErrorMessages errors={props.errors?.email?._errors} />
          </div>
          <div>
            <input
              name="password"
              type={props.showPassword ? "text" : "password"}
              value={props.formData.password}
              placeholder="Enter your password here"
              className={props.errors?.password?._errors ? "bg-red-600" : ""}
              onChange={props.onChange}
            />
            <ErrorMessages errors={props.errors?.password?._errors} />
          </div>
          <div>
            <input
              name="confirmPassword"
              type={props.showPassword ? "text" : "password"}
              value={props.formData.confirmPassword}
              placeholder="Confirm your password here"
              className={
                props.errors?.confirmPassword?._errors ? "bg-red-600" : ""
              }
              onChange={props.onChange}
            />
            <ErrorMessages errors={props.errors?.confirmPassword?._errors} />
          </div>
          <input
            type="button"
            value="show password"
            onClick={() => {
              props.setShowPassword(!props.showPassword);
            }}
          />
          <div>
            <input
              name="firstName"
              type="text"
              value={props.formData.firstName}
              placeholder="First name"
              className={props.errors?.firstName?._errors ? "bg-red-600" : ""}
              onChange={props.onChange}
            />
            <ErrorMessages errors={props.errors?.firstName?._errors} />
          </div>
          <div>
            <input
              name="secondName"
              type="text"
              value={props.formData.secondName}
              placeholder="Second name"
              className={props.errors?.secondName?._errors ? "bg-red-600" : ""}
              onChange={props.onChange}
            />
            <ErrorMessages errors={props.errors?.secondName?._errors} />
          </div>

          <input
            type="button"
            value="submit"
            onClick={() => props.onSubmission()}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
