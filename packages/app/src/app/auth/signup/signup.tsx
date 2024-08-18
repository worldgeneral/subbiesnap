"use client";

import {
  HydrationBoundary,
  dehydrate,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";
import { signUpQueryOptions } from "./query";
import { getQueryClient } from "@/app/get-query-client";
import Error from "@/components/error/error";
import { User, registerSchema } from "@subbiesnap/types/users";
import ConfirmEmail from "@/components/confirmEmail/confirmEmail";
import { ZodError } from "zod";
import { z } from "zod";

export default function SignUp() {
  const queryClient = getQueryClient();

  const [user, setUser] = useState<User>();

  const mutation = useMutation({
    mutationFn: signUpQueryOptions,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    secondName: "",
  });

  const [authSchemaError, setAuthSchemaError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmission = () => {
    setAuthSchemaError(undefined);
    try {
      const validation = registerSchema.parse(formData);
      mutation.mutate(validation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
      }
      return;
    }
  };

  if (mutation.error) {
    console.log(user, mutation);
    return <Error error={mutation.error.message} />;
  }

  if (mutation.data) {
    console.log(user, mutation);
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
          <input
            value={formData.email}
            placeholder="Enter your email here"
            onChange={(ev) =>
              setFormData({
                ...formData,
                email: ev.target.value,
              })
            }
            className={authSchemaError ? "bg-red-600" : ""}
          />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            placeholder="Enter your password here"
            onChange={(ev) =>
              setFormData({
                ...formData,
                password: ev.target.value,
              })
            }
          />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            placeholder="Confirm your password here"
            onChange={(ev) =>
              setFormData({
                ...formData,
                confirmPassword: ev.target.value,
              })
            }
          />
          <input
            type="button"
            value="show password"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
          <input
            type="text"
            value={formData.firstName}
            placeholder="First name"
            onChange={(ev) =>
              setFormData({
                ...formData,
                firstName: ev.target.value,
              })
            }
          />
          <input
            type="text"
            value={formData.secondName}
            placeholder="First name"
            onChange={(ev) =>
              setFormData({
                ...formData,
                secondName: ev.target.value,
              })
            }
          />

          <input type="button" value="submit" onClick={() => onSubmission()} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
