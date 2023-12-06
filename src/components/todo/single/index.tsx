"use client";

import { Button } from "@mui/material";

type TodoProps = {
  id: string;
  title: string;
};

export function Todo({ id, title }: TodoProps) {
  return (
    <>
      <Button
        key={id}
        onClick={() => console.log("Clicked")}
        sx={{ display: "block", bgcolor: "white" }}
      >
        {title}
      </Button>
    </>
  );
}
