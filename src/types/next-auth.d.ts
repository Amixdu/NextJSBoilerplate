import "next-auth";
import { type Session  } from "next-auth";

interface CustomUser {
  id: number,
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  roles: string[]
}

declare module "next-auth" {
  export interface Session {
    user?: CustomUser | null;
  }
}
