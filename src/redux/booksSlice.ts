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
  availability: boolean;
};

type BooksState = {
  books: Book[];
  loading: boolean;
  posting: boolean;
  error: string | null;
};

const initialState: BooksState = {
  books: [],
  loading: false,
  posting: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const res = await fetch('http://localhost:5000/all-books');
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to fetch books');
    }
    return await res.json();
  }
);

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

type UpdateBookArgs = {
  id: string | number;
  book: Book;
};

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, book }: UpdateBookArgs) => {
    const res = await fetch(`http://localhost:5000/books/${id}` , {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to update book');
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
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching books';
      })
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
      })
      .addCase(updateBook.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.posting = false;
        const updated: any = action.payload;
        const updatedId = updated.id || updated._id;
        state.books = state.books.map((b: any) => {
          const currentId = b.id || b._id;
          if (updatedId && currentId && currentId === updatedId) return updated;
          if (updated.isbn && b.isbn && b.isbn === updated.isbn) return updated;
          return b;
        });
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.posting = false;
        state.error = action.error.message || 'Error updating book';
      });
  },
});

export default booksSlice.reducer;

export const selectBooks = (state: RootState) => state.books.books;
export const selectLoading = (state: RootState) => state.books.loading;
export const selectPosting = (state: RootState) => state.books.posting;
export const selectError = (state: RootState) => state.books.error;


