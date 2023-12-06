import { Box, Button, TextField } from "@mui/material";
import styles from "./page.module.scss";
import { prisma } from "@/db";
import { redirect } from "next/navigation";

// Note: These can be moved inside the API folder (POST to todos/) and then call that API here
const createTodo = async (data: FormData) => {
  "use server";
  const title = data.get("title")?.valueOf();
  if (typeof title !== "string") {
    throw new Error("Invalid");
  }
  console.log(title);
  await prisma.todo.create({ data: { title, complete: false } });
  redirect("/");
};

const AddTodo = () => {
  return (
    <div className={styles.container}>
      <p className={styles.test}>New Todo</p>
      <form action={createTodo}>
        <TextField
          name="title"
          sx={{
            "& input": {
              color: "white",
              borderColor: "white",
            },
            "& fieldset": {
              borderColor: "white",
            },
            width: "100%",
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </div>
  );
};

export default AddTodo;
