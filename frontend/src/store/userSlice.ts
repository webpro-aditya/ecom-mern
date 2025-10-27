import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    const token = state.user.token;

    if (!token) return rejectWithValue("No token found");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user");

      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
