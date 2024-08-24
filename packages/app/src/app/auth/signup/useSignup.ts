import { getQueryClient } from "@/app/get-query-client";
import { User, registerSchema } from "@subbiesnap/types/users";
import { useMutation } from "@tanstack/react-query";
import { ChangeEventHandler, useState } from "react";
import { ZodFormattedError, z } from "zod";
import { signUpQueryOptions } from "./query";
import { AxiosError, AxiosResponse } from "axios";
import { ValidationErrorResponseData } from "@subbiesnap/types/errorHandler";
import { ApiResponseError } from "@subbiesnap/constants/api-response-errors";

export type Fields = z.infer<typeof registerSchema>;

export const useSignup = () => {
  const queryClient = getQueryClient();

  const mutation = useMutation<
    AxiosResponse<User>,
    AxiosError<ValidationErrorResponseData>,
    Fields
  >({
    mutationFn: signUpQueryOptions,
    onSuccess: (response) => {
      setUser(response.data);
    },
    onError: (errors) => {
      const validationIssues = errors.response?.data;
      const errorType = errors.response?.data.errorType;
      if (errorType === ApiResponseError.validation) {
        return setErrors((preVal) => ({
          ...preVal,
          formError: validationIssues!.issues,
        }));
      }
      if (errorType === ApiResponseError.appError) {
        setErrors((preVal) => ({
          ...preVal,
          apiError: validationIssues?.errorMessage,
        }));
      }
    },
  });

  type err = {
    formError?: ZodFormattedError<Fields>;
    apiError?: string;
  };
  const [user, setUser] = useState<User>();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<err>();
  const [formData, setFormData] = useState<Fields>({
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
    setErrors((preVal) => ({
      ...preVal,
      formError: error.format(),
    }));
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const name = ev.target.name;
    setErrors((preVal) => ({
      ...preVal,
      formError: { ...preVal?.formError, _errors: [], [name]: [] },
    }));
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
