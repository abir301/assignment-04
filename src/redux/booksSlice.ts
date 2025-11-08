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

export type BorrowedBook = {
  _id: string;
  bookId: string;
  title: string;
  isbn: string;
  quantity: number;
  dueDate: string;
  borrowDate: string;
  status: string;
};

type BooksState = {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  loading: boolean;
  posting: boolean;
  error: string | null;
};

const initialState: BooksState = {
  books: [],
  borrowedBooks: [],
  loading: false,
  posting: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const res = await fetch('https://assignment-04-backend.vercel.app/all-books');
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
    const res = await fetch('https://assignment-04-backend.vercel.app/all-books', {
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
    const res = await fetch(`https://assignment-04-backend.vercel.app/all-books/${id}` , {
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

export const fetchBorrowedBooks = createAsyncThunk(
  'books/fetchBorrowedBooks',
  async () => {
    const res = await fetch('https://assignment-04-backend.vercel.app/borrows');
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to fetch borrowed books');
    }
    return await res.json();
  }
);

export const decreaseCopies = createAsyncThunk(
  'books/decreaseCopies',
  async ({ id, copies }: { id: string; copies: number }) => {
    const res = await fetch(`https://assignment-04-backend.vercel.app/all-books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ copies }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to decrease copies');
    }
    return await res.json();
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string | number) => {
    const res = await fetch(`https://assignment-04-backend.vercel.app/all-books/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to delete book');
    }
    return id;
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
      })
      .addCase(fetchBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowedBooks = action.payload;
      })
      .addCase(fetchBorrowedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching borrowed books';
      })
      .addCase(decreaseCopies.fulfilled, (state, action) => {
        const updated: any = action.payload;
        const updatedId = updated.id || updated._id;
        state.books = state.books.map((b: any) => {
          const currentId = b.id || b._id;
          if (updatedId && currentId && currentId === updatedId) return updated;
          if (updated.isbn && b.isbn && b.isbn === updated.isbn) return updated;
          return b;
        });
      })
      .addCase(deleteBook.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.posting = false;
        const deletedId = action.payload;
        state.books = state.books.filter((b: any) => {
          const currentId = String(b.id || b._id || b.isbn);
          return currentId !== String(deletedId);
        });
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.posting = false;
        state.error = action.error.message || 'Error deleting book';
      });
  },
});

export default booksSlice.reducer;

export const selectBooks = (state: RootState) => state.books.books;
export const selectBorrowedBooks = (state: RootState) => state.books.borrowedBooks;
export const selectLoading = (state: RootState) => state.books.loading;
export const selectPosting = (state: RootState) => state.books.posting;
export const selectError = (state: RootState) => state.books.error;
