import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks, selectBooks, selectLoading, selectError, updateBook, deleteBook } from '../redux/booksSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Books() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [editingBook, setEditingBook] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    copies: '',
    description: '',
    bookCover: '',
  });

  const [borrowingBook, setBorrowingBook] = useState<any>(null);
  const [borrowQty, setBorrowQty] = useState<string>('');
  const [borrowDueDate, setBorrowDueDate] = useState<string>('');
  const [deletingBook, setDeletingBook] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn.toString(),
      copies: book.copies.toString(),
      description: book.description,
      bookCover: book.bookCover || '',
    });
  };

  const handleDelete = (book: any) => {
    setDeletingBook(book);
  };

  const confirmDelete = async () => {
    if (!deletingBook) return;
    
    const bookId = (deletingBook as any)?._id ?? (deletingBook as any)?.id ?? deletingBook?.isbn;
    if (!bookId) {
      toast.error('Invalid book id');
      return;
    }

    try {
      await dispatch(deleteBook(bookId)).unwrap();
      toast.success('Book deleted successfully');
      setDeletingBook(null);
      dispatch(fetchBooks());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete book');
    }
  };

  const cancelDelete = () => {
    setDeletingBook(null);
  };

  const openBorrow = (book: any) => {
    const hasId = (book as any)?._id;
    if (Number(book.copies) < 1 || !hasId) {
      toast.error('This book is unavailable');
      return;
    }
    setBorrowingBook(book);
    setBorrowQty('');
    setBorrowDueDate('');
  };

  const cancelBorrow = () => {
    setBorrowingBook(null);
    setBorrowQty('');
    setBorrowDueDate('');
  };

  const submitBorrow = async () => {
    if (!borrowingBook?._id) {
      toast.error('Invalid book id');
      return;
    }
    const qtyNum = Number(borrowQty);
    if (!qtyNum || qtyNum < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    if (qtyNum > Number(borrowingBook.copies || 0)) {
      toast.error('Quantity exceeds available copies');
      return;
    }
    try {
      const res = await fetch('https://assignment-04-backend.vercel.app/borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: borrowingBook._id,
          title: borrowingBook.title,
          isbn: borrowingBook.isbn,
          quantity: qtyNum,
          dueDate: borrowDueDate || null,
        }),

      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to borrow');
      }

      await fetch(`https://assignment-04-backend.vercel.app/all-books/${borrowingBook._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ copies: qtyNum }),
      });

      await res.json();
      toast.success('Borrowed successfully');
      setBorrowingBook(null);
      setBorrowQty('');
      setBorrowDueDate('');
      dispatch(fetchBooks());
    } catch (e: any) {
      toast.error(e?.message || 'Failed to borrow');
    }
  };

  const handleEditSubmit = async () => {
    const trimmedDescription = editForm.description.trim();
    const trimmedTitle = editForm.title.trim();
    const trimmedAuthor = editForm.author.trim();
    const trimmedBookCover = editForm.bookCover.trim();

    if (!trimmedTitle) {
      toast.error('Title is required.');
      return;
    }

    if (!trimmedAuthor) {
      toast.error('Author is required.');
      return;
    }

    if (!editForm.genre) {
      toast.error('Please select a genre.');
      return;
    }

    if (trimmedDescription.length < 10) {
      toast.error('Description must be at least 10 characters.');
      return;
    }

    if (!trimmedBookCover) {
      toast.error('Book cover URL is required.');
      return;
    }

    if (!/^https?:\/\/\S+$/.test(trimmedBookCover)) {
      toast.error('Book cover must be a valid URL.');
      return;
    }

    const updatedData = {
      title: trimmedTitle,
      author: trimmedAuthor,
      genre: editForm.genre,
      isbn: Number(editForm.isbn) || 0,
      copies: Number(editForm.copies) || 0,
      description: trimmedDescription,
      bookCover: trimmedBookCover,
      availability: (Number(editForm.copies) || 0) >= 1,
    };

    try {
      const id = editingBook?.id || editingBook?._id || editingBook?.isbn;
      await dispatch(updateBook({ id, book: updatedData })).unwrap();
      toast.success('Book updated successfully');
      setEditingBook(null);
      dispatch(fetchBooks());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update book');
    }
  };

  const handleEditCancel = () => {
    setEditingBook(null);
    setEditForm({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      copies: '',
      description: '',
      bookCover: '',
    });
  };

  if (loading) {
    return (
      <div className="p-8 h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Books Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Books Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading books</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Books Management</h1>

      {borrowingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelBorrow} />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Borrow Book</h2>
              <button
                type="button"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={cancelBorrow}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">{borrowingBook.title}</div>
                <div className="text-xs text-gray-500">Available copies: {borrowingBook.copies}</div>
              </div>

              <div>
                <label htmlFor="borrow-qty" className="mb-2 block text-sm font-medium text-gray-900">Quantity</label>
                <input
                  id="borrow-qty"
                  type="number"
                  min={1}
                  max={Number(borrowingBook.copies) || 0}
                  placeholder="1"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none [appearance:textfield] focus:border-gray-500 focus:ring-4 focus:ring-blue-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={borrowQty}
                  onChange={(e) => setBorrowQty(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="borrow-due" className="mb-2 block text-sm font-medium text-gray-900">Due Date</label>
                <input
                  id="borrow-due"
                  type="date"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={borrowDueDate}
                  onChange={(e) => setBorrowDueDate(e.target.value)}
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  onClick={submitBorrow}
                >
                  Confirm Borrow
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  onClick={cancelBorrow}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleEditCancel} />
          <div className="relative z-10 w-full max-w-2xl mx-4 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
              <button
                type="button"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={handleEditCancel}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="edit-title" className="mb-2 block text-sm font-medium text-gray-900">Title</label>
                <input
                  id="edit-title"
                  placeholder="Book title"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit-bookCover" className="mb-2 block text-sm font-medium text-gray-900">Book Cover URL *</label>
                <input
                  id="edit-bookCover"
                  type="url"
                  placeholder="https://example.com/book-cover.jpg"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={editForm.bookCover}
                  onChange={(e) => setEditForm({ ...editForm, bookCover: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-author" className="mb-2 block text-sm font-medium text-gray-900">Author</label>
                <input
                  id="edit-author"
                  placeholder="Author name"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit-genre" className="mb-2 block text-sm font-medium text-gray-900">Genre</label>
                <select
                  id="edit-genre"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={editForm.genre}
                  onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                >
                  <option value="" disabled>
                    Select a genre
                  </option>
                  <option>Fiction</option>
                  <option>Mystery & Thriller</option>
                  <option>Fantasy</option>
                  <option>Science Fiction</option>
                  <option>Romance</option>
                  <option>Historical Fiction</option>
                  <option>Nonfiction</option>
                  <option>Biography & Memoir</option>
                  <option>Young Adult</option>
                  <option>Horror</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-isbn" className="mb-2 block text-sm font-medium text-gray-900">ISBN</label>
                <input
                  id="edit-isbn"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g., 9780131103627"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none [appearance:textfield] focus:border-gray-500 focus:ring-4 focus:ring-blue-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={editForm.isbn}
                  onChange={(e) => setEditForm({ ...editForm, isbn: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit-copies" className="mb-2 block text-sm font-medium text-gray-900">Copies</label>
                <input
                  id="edit-copies"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="0"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none [appearance:textfield] focus:border-gray-500 focus:ring-4 focus:ring-blue-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={editForm.copies}
                  onChange={(e) => setEditForm({ ...editForm, copies: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-2 block text-sm font-medium text-gray-900">Description</label>
                <textarea
                  id="edit-description"
                  rows={5}
                  placeholder="Short summary or notes"
                  className="w-full resize-y rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  onClick={handleEditSubmit}
                >
                  Update Book
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelDelete} />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Delete Book</h2>
              <button
                type="button"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={cancelDelete}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this book?
                </p>

              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Copies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book, index) => (
              <tr key={book.isbn || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.genre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.isbn}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.copies}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${Number(book.copies) >= 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {Number(book.copies) >= 1 ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const id = (book as any)?._id ?? (book as any)?.id ?? book?.isbn;
                        if (!id) return;
                        navigate(`/book/${id}`);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => openBorrow(book)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Borrow
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;
