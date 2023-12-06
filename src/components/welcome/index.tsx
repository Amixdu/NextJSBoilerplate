"use client";
import { Button } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Welcome = () => {
  const data = useSession();
  console.log(data)
  if (data?.status === "loading") return <p>Loading...</p>;
  else if (data.status === "authenticated") {
    redirect('/todos')
  }
  return (
    <>
      <h1> Welcome </h1>
      <Button onClick={() => signIn("keycloak")}> Sign in </Button>
    </>
  );
};

export default Welcome;
