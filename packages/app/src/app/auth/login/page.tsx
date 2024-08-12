"use client";

import { useState } from "react";
import { authSchema } from "@subbiesnap/types/auth";
import { User } from "@subbiesnap/types/users";
import api from "@/utils/fetch";

export default function LoginIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User>();
  const [authSchemaError, setAuthSchemaError] = useState("");

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
      setUser(await response);
    }
  };

  return (
    <div>
      {user && <p>{JSON.stringify(user)}</p>}
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
