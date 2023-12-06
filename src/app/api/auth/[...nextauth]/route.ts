import { jwtDecode } from "jwt-decode";
import nextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { Pool } from "pg";
import { Adapter } from "next-auth/adapters";
//
import customAuthAdapter from "@/utils/auth-adapter";
import axios from "axios";

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: parseInt(process.env.PG_PORT as string),
  max: parseInt(process.env.PG_MAX as string),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT as string),
  connectionTimeoutMillis: parseInt(
    process.env.PG_CONNECTION_TIMEOUT as string
  ),
});

const refreshTokens = async (refreshToken: string) => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.KC_CLIENT_ID as string);
  params.append("client_secret", process.env.KC_CLIENT_SECRET as string);
  params.append("refresh_token", refreshToken);
  const url = `${process.env.KC_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/token`;
  try {
    const axiosRes = await axios.post(url, params);
    // const rptTokens = await __getRptTokens(accessToken);
    // return {
    //   accessToken: rptTokens?.access_token,
    //   idToken,
    //   refreshToken,
    // };
    return axiosRes?.data;
  } catch (error) {
    console.log(error);
  }
};

export const authOptions: NextAuthOptions = {
  adapter: customAuthAdapter(pool) as unknown as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KC_CLIENT_ID as string,
      clientSecret: process.env.KC_CLIENT_SECRET as string,
      issuer: `${process.env.KC_URL}/realms/${process.env.KC_REALM}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      console.log("JWT", token.accessTokenExpires);
      console.log("CURRENT", Date.now() / 1000);
      // The processing of JWT occurs before handling sessions.
      if (account) {
        // 'account' is only available the first time this callback is called on a new session
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpires = account.expires_at;
        token.refreshTokenExpires = account.refresh_expires_in;
        token.user = user;
      }
      if (Date.now() / 1000 < (token.accessTokenExpires as number)) {
        return token;
      } else {
        // Renew tokens if access token is expired
        const newTokens = await refreshTokens(token?.refreshToken as string);
        return {
          ...token,
          accessToken: newTokens?.access_token,
          refreshToken: newTokens?.refresh_token,
          idToken: newTokens?.id_token,
          accessTokenExpires:
            Math.floor(Date.now() / 1000) + newTokens?.expires_in,
          refreshTokenExpires:
            Math.floor(Date.now() / 1000) + newTokens?.refresh_expires_in,
          // user: user,
        };
      }
    },
    // The session receives the token from JWT
    async session({ token }) {
      console.log("token", token)
      const { user } = token as {
        user: {
          id: number;
          email: string;
          first_name: string;
          last_name: string;
          image: string;
          roles: string[];
        };
      };
      const decodedToken = jwtDecode(token.accessToken as string) as {
        realm_access: { roles: string[] };
      };
      return {
        accessToken: token.accessToken as string,
        idToken: token.idToken as string,
        refreshToken: token.refreshToken as string,
        expires: token.accessTokenExpires as string,
        user: {
          firstName: user?.first_name,
          lastName: user?.last_name,
          email: user?.email,
          id: user?.id,
          image: user?.image,
          roles: decodedToken.realm_access.roles,
        },
      };
    },
  },
  events: {
    async signOut({ token }) {
      const url = `${process.env.KC_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/logout?id_token_hint=${token?.idToken}&post_logout_redirect_uri=${process.env.KC_LOGOUT_REDIRECT_URI}`;
      try {
        await axios.get(url);
      } catch (err) {
        console.log(err);
      }
    },
  },
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
