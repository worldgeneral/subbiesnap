"use client";

import { useState } from "react";
import { authSchema, User } from "@subbiesnap/types";
import api from "@/utils/fetch";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import {
  HydrationBoundary,
  dehydrate,
  queryOptions,
} from "@tanstack/react-query";

export default function LoginIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authSchemaError, setAuthSchemaError] = useState("");
  const router = useRouter();

  const onButtonClick = async () => {
    setAuthSchemaError("");
    try {
      authSchema.parse({ email: email, password: password });
    } catch (error) {
      setAuthSchemaError("please enter a valid email or password");
      return;
    }

    const response = await api({
      url: "/api/login",
      body: { email: email, password: password },
    });
    if (response == typeof String) {
      return setAuthSchemaError(response);
    } else {
      router.push("/");
    }
  };

  return (
    <div>
      <h1>Please log in to SubbieSnap</h1>
      <div>
        {authSchemaError && <span>{authSchemaError}</span>}
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={authSchemaError ? "bg-red-600" : ""}
        />
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <input type="button" onClick={onButtonClick} value={"Log in"} />
      </div>
    </div>
  );
}
