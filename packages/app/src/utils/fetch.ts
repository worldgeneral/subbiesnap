import { HttpStatus } from "@subbiesnap/constants/https";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

type api = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body: any;
};

export default async function api(request: api) {
  const router = useRouter();
  const response = await fetch("/api/login", {
    method: request.method ? request.method : "POST",
    headers: request.headers
      ? request.headers
      : { "Content-Type": "application/json" },
    body: JSON.stringify(request.body),
  });

  if (response.status === HttpStatus.OK) {
    return response.json();
  }
  if (response.status == HttpStatus.InternalServerError) {
    router.push("/error");
  } else {
    const error = await response.json();
    return error.errorMessage;
  }
}
