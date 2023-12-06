import { prisma } from "@/db";
import Link from "next/link";
import { Todo } from "@/components/todo/single";
import styles from "./page.module.scss";
import { Button } from "@mui/material";

const getTodos = async () => prisma.todo.findMany();

const TodoList = async () => {
  const todos = await getTodos()
  return (
    <>
      <div className={styles.container}>
        <h1> Todos </h1>
        <Link href="/todos/add-new" className={styles.addNewButton}>
          Add new
        </Link>
      </div>
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} id={todo.id} title={todo.title} />
        ))}
      </ul>
      <Button> </Button>
    </>
  );
};

export default TodoList;
