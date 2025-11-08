import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks, selectBooks, selectLoading } from '../redux/booksSlice';

function FeaturedBooks() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const featuredBooks = books.slice(0, 6);

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Books</h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading books...</div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredBooks.length === 0) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Books</h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">No books available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="w-[80%] mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Books</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {featuredBooks.map((book, index) => {
            const bookId = (book as any)?._id ?? (book as any)?.id ?? book?.isbn;
            return (
              <div
                key={book.isbn || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (bookId) {
                    navigate(`/book/${bookId}`);
                  }
                }}
              >
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  {book.bookCover ? (
                    <img
                      src={book.bookCover}
                      alt={book.title}
                      className=" h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-sm">No Cover</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {book.genre}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${Number(book.copies) >= 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {Number(book.copies) >= 1 ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/books')}
            className=" bg-gray-800 text-white py-3 px-5 rounded-lg transition-colors duration-300 text-lg"
          >
            All Books
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedBooks;

