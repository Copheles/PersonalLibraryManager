import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../../../global";

export interface UserState {
  data: IUser | null;
}

const savedUser =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

  
const initialState: UserState = savedUser
  ? { data: JSON.parse(savedUser) }
  : { data: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    resetUser: (state) => {
      state.data = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
