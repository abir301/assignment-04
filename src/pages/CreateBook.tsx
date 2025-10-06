import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectPosting, postBook } from '../redux/booksSlice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CreateBook() {
  const dispatch = useAppDispatch();
  const posting = useAppSelector(selectPosting);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('');
  const [description, setDescription] = useState('');
  const [bookCover, setBookCover] = useState('');

  const onSubmit = async () => {
    const trimmedDescription = description.trim();
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedBookCover = bookCover.trim();

    if (!trimmedTitle) {
      toast.error('Title is required.');
      return;
    }

    if (!trimmedAuthor) {
      toast.error('Author is required.');
      return;
    }

    if (!genre) {
      toast.error('Please select a genre.');
      return;
    }

    if (trimmedDescription.length < 10) {
      toast.error('Description must be at least 10 characters.');
      return;
    }

    if (!trimmedBookCover && !/^https?:\/\/\S+$/.test(trimmedBookCover)) {
      toast.error('Book cover must be a valid URL.');
      return;
    }

    const data = {
      title: trimmedTitle,
      author: trimmedAuthor,
      genre,
      isbn: Number(isbn) || 0,
      copies: Number(copies) || 0,
      description: trimmedDescription,
      bookCover: trimmedBookCover,
      availability: true,
    };

    try {
      await dispatch(postBook(data)).unwrap();
      toast.success('Book added successfully');
      setTitle('');
      setAuthor('');
      setGenre('');
      setIsbn('');
      setCopies('');
      setDescription('');
      setBookCover('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add book');
    }
  };

  return (
    <section className="bg-indigo-50 py-10">
      <div className="mx-auto w-full max-w-lg px-4">
        <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">Add Book</h2>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
          <div className="grid gap-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
                Title
              </label>
              <input
                id="title"
                placeholder="Book title"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="bookCover" className="mb-2 block text-sm font-medium text-gray-900">
                Book Cover URL *
              </label>
              <input
                id="bookCover"
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                value={bookCover}
                onChange={(e) => setBookCover(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-900">
                Author
              </label>
              <input
                id="author"
                placeholder="Author name"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="genre" className="mb-2 block text-sm font-medium text-gray-900">
                Genre
              </label>
              <select
                id="genre"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
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
              <label htmlFor="isbn" className="mb-2 block text-sm font-medium text-gray-900">
                ISBN
              </label>
              <input
                id="isbn"
                type="number"
                inputMode="numeric"
                placeholder="e.g., 9780131103627"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none [appearance:textfield] focus:border-gray-500 focus:ring-4 focus:ring-blue-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="copies" className="mb-2 block text-sm font-medium text-gray-900">
                Copies
              </label>
              <input
                id="copies"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="0"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none [appearance:textfield] focus:border-gray-500 focus:ring-4 focus:ring-blue-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Short summary or notes"
                className="w-full resize-y rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-4 focus:ring-blue-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
              onClick={onSubmit}
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Add Book'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
