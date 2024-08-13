"use client";

import { useState } from "react";

export default function signUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    secondName: "",
  });
  const [authSchemaError, setAuthSchemaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleForm = () => {
    console.log("hi");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
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
          type="button"
          value="show password"
          onClick={handleShowPassword}
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

        <input type="button" value="submit" onClick={handleForm} />
      </div>
    </div>
  );
}
