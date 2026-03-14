import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addBookmarkFirebase,
  loadBookmarksFromCloud,
  removeBookmarkFirebase,
} from "../firebase/manageBookmarks";

export const addBookmarkAsync = createAsyncThunk(
  "bookmarks/add",
  async (material, thunkAPI) => {
    const state = thunkAPI.getState();
    const user = state.user.user;
    if (!user) return thunkAPI.rejectWithValue("Not logged in");

    const response = await addBookmarkFirebase(user.uid, material);
    return response.success
      ? material
      : thunkAPI.rejectWithValue(response.message);
  }
);

export const removeBookmarkAsync = createAsyncThunk(
  "bookmarks/remove",
  async (materialId, thunkAPI) => {
    const state = thunkAPI.getState();
    const user = state.user.user;
    if (!user) return thunkAPI.rejectWithValue("Not logged in");

    const response = await removeBookmarkFirebase(user.uid, materialId);
    return response.success
      ? materialId
      : thunkAPI.rejectWithValue(response.message);
  }
);

export const loadBookmarksAsync = createAsyncThunk(
  "bookmarks/load",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const user = state.user.user;
    if (!user) return [];
    
    try {
      const response = await loadBookmarksFromCloud(user.uid);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: { items: [], loading: false },
  reducers: {
    clearBookmarks: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookmarksAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBookmarksAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addBookmarkAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeBookmarkAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
