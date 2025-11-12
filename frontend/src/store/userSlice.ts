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

const initialState: UserState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const base = `${import.meta.env.VITE_API_URL}`;
      const url = `${base}auth/login`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      return data;
    } catch (error: any) {
      // Fallback to alternate host (swap localhost and 127.0.0.1)
      try {
        const base = `${import.meta.env.VITE_API_URL}`;
        const altBase = base.includes("127.0.0.1")
          ? base.replace("127.0.0.1", "localhost")
          : base.replace("localhost", "127.0.0.1");
        const response = await fetch(`${altBase}auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        return data;
      } catch (e2: any) {
        return rejectWithValue(e2.message || error.message);
      }
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const base = `${import.meta.env.VITE_API_URL}`;
      const url = `${base}auth/me`;
      let response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user");
      return data;
    } catch (error: any) {
      // Fallback to alternate host
      try {
        const base = `${import.meta.env.VITE_API_URL}`;
        const altBase = base.includes("127.0.0.1")
          ? base.replace("127.0.0.1", "localhost")
          : base.replace("localhost", "127.0.0.1");
        const response = await fetch(`${altBase}auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch user");
        return data;
      } catch (e2: any) {
        return rejectWithValue(e2.message || error.message);
      }
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
        state.token = null;
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
