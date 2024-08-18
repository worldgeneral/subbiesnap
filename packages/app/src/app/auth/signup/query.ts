import { queryOptions, useMutation } from "@tanstack/react-query";
import { User, registerSchema } from "@subbiesnap/types/users";
import { z } from "zod";

export const signUpQueryOptions = async (
  formData: z.infer<typeof registerSchema>
) => {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};
