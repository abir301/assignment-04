import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks, selectBooks, selectLoading, selectError, updateBook } from '../redux/booksSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Books() {
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

  const handleDelete = (bookId: number) => {
    console.log('Delete book:', bookId);
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
      availability: editingBook.availability,
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
      <div className="p-8">
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    book.availability
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.availability ? 'Available' : 'Unavailable'}
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
                      onClick={() => handleDelete(book.isbn)}
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
