import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../services/user-api";
//
type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};
type UsersData = {
  docs: UserData[];
};
type UserState = {
  users: UsersData;
  test: User[];
};
type User = {
  id: number;
  name: string;
  email: number;
};
//
const initialState = {
  users: {
    docs: [
      {
        id: "1",
        firstName: "John",
        lastName: "Cena",
        email: "johncena@gmail.com",
      },
    ],
  },
  test: [],
} as UserState;
/**
 * Redux slice for the user feature
 */
const userSlice = createSlice({
  name: "feature/users",
  initialState,
  reducers: {
    setData: (state, action) => ({
      ...state,
      users: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUsers.matchFulfilled,
      (state, action) => {
        state.test = action.payload;
      }
    );
  },
});
//
export const { setData } = userSlice.actions;
export default userSlice;
