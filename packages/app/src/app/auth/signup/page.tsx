"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SignUp from "./signup";

export default function signUp() {
  return (
    <main className="">
      <SignUp />
    </main>
  );
}
