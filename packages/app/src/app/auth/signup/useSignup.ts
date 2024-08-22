import { getQueryClient } from "@/app/get-query-client";
import { User, registerSchema } from "@subbiesnap/types/users";
import { useMutation } from "@tanstack/react-query";
import { ChangeEventHandler, useState } from "react";
import { ZodFormattedError, z } from "zod";
import { signUpQueryOptions } from "./query";

type Fields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  secondName: string;
};

export const useSignup = () => {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: signUpQueryOptions,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const [user, setUser] = useState<User>();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ZodFormattedError<Fields>>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    secondName: "",
  });

  const onSubmission = () => {
    setErrors(undefined);
    const { success, error } = registerSchema.safeParse(formData);
    if (success) {
      return mutation.mutate(formData);
    }
    setErrors(error.format());
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const name = ev.target.name;
    setErrors((preVal) => ({ ...preVal, _errors: [], [name]: [] }));
    setFormData((preVal) => ({
      ...preVal,
      [name]: ev.target.value,
    }));
  };

  return {
    queryClient,
    mutation,
    user,
    formData,
    errors,
    setErrors,
    showPassword,
    setShowPassword,
    onSubmission,
    onChange,
  };
};
