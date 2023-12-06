import { AdapterUser, AdapterAccount } from "next-auth/adapters";
import { Pool } from "pg";

export default function customAuthAdaptor(client: Pool, options = {}) {
  return {
    // Function to handle user creation on users table
    async createUser(user: AdapterUser) {
      try {
        const sql = `
        INSERT INTO users (first_name, last_name, email, image) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, first_name, last_name, email, image`;
        const firstName = user.name?.split(" ")[0] ?? "";
        const lastName = user.name?.split(" ")[1] ?? "";
        let result = await client.query(sql, [
          firstName,
          lastName,
          user.email,
          user.image,
        ]);
        return result.rows[0];
      } catch (err) {
        console.log(err);
        return;
      }
    },
    // Function to retrieve a user by id from the users table
    async getUser(id: string) {
      try {
        const sql = `SELECT * FROM users WHERE id = $1`;
        let result = await client.query(sql, [id]);
        return result.rows[0];
      } catch (err) {
        console.log(err);
        return;
      }
    },
    // Function to retrieve a user by email from the users table
    async getUserByEmail(email: string) {
      try {
        const sql = `SELECT * FROM users WHERE email = $1`;
        let result = await client.query(sql, [email]);
        return result.rows[0];
      } catch (err) {
        console.log(err);
        return;
      }
    },
    // Function to retrive a user by account id from the users table
    async getUserByAccount({ providerAccountId }: AdapterAccount) {
      try {
        const sql = `SELECT * FROM users WHERE sub = $1`;
        const result = await client.query(sql, [providerAccountId]);
        return result.rows[0];
      } catch (err) {
        console.log(err);
      }
    },
    // Function to add the sub (account id) to the users table
    async linkAccount(account: AdapterAccount) {
      try {
        const sql = `
          UPDATE users
          SET sub = $1
          WHERE id = $2;
        `;
        const params = [account.providerAccountId, account.userId];
        await client.query(sql, params);
        return account;
      } catch (err) {
        console.log(err);
        return;
      }
    },
    async updateUser() {},
    async createSession() {},
    async getSessionAndUser() {},
    async updateSession() {},
    async deleteSession() {},
  };
}
