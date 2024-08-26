import { User } from "@subbiesnap/types";
import { getAppInstance } from "@/utils/api";
import { Fields } from "./use-signup";

export const signUpQueryOptions = async (formData: Fields) => {
  return getAppInstance().post<User>("/users", formData);
};
