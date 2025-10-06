import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

export type Book = {
  title: string;
  author: string;
  genre: string;
  isbn: number;
  copies: number;
  description: string;
  bookCover?: string;
};

type BooksState = {
  posting: boolean;
  error: string | null;
};

const initialState: BooksState = {
  posting: false,
  error: null,
};

export const postBook = createAsyncThunk(
  'books/postBook',
  async (book: Book) => {
    const res = await fetch('http://localhost:5000/all-books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to post book');
    }
    return await res.json();
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postBook.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(postBook.fulfilled, (state) => {
        state.posting = false;
      })
      .addCase(postBook.rejected, (state, action) => {
        state.posting = false;
        state.error = action.error.message || 'Error posting book';
      });
  },
});

export default booksSlice.reducer;

export const selectPosting = (state: RootState) => state.books.posting;


