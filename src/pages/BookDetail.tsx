import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks, selectBooks } from '../redux/booksSlice';
import { toast } from 'react-toastify';

function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);

  const [borrowQty, setBorrowQty] = useState<string>('1');
  const [borrowDueDate, setBorrowDueDate] = useState<string>('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  useEffect(() => {
    if (!books || books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [books, dispatch]);

  const book = books.find((b: any) => String(b?._id ?? b?.id ?? b?.isbn) === String(id));

  const handleBorrow = () => {
    const bookId = (book as any)?._id ?? (book as any)?.id ?? book?.isbn;
    if (!bookId) {
      toast.error('Invalid book id');
      return;
    }
    if (Number(book?.copies) < 1) {
      toast.error('This book is unavailable');
      return;
    }
    setShowBorrowModal(true);
  };

  const submitBorrow = async () => {
    const bookId = (book as any)?._id ?? (book as any)?.id ?? book?.isbn;
    if (!bookId) {
      toast.error('Invalid book id');
      return;
    }
    const qtyNum = Number(borrowQty);
    if (!qtyNum || qtyNum < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    if (qtyNum > Number(book?.copies || 0)) {
      toast.error('Quantity exceeds available copies');
      return;
    }
    try {
      const res = await fetch('https://assignment-04-backend.vercel.app/borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
          title: book?.title,
          isbn: book?.isbn,
          quantity: qtyNum,
          dueDate: borrowDueDate || null,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to borrow');
      }
      await res.json();
      toast.success('Borrowed successfully');
      setShowBorrowModal(false);
      setBorrowQty('1');
      setBorrowDueDate('');
      dispatch(fetchBooks());
    } catch (e: any) {
      toast.error(e?.message || 'Failed to borrow');
    }
  };

  const cancelBorrow = () => {
    setShowBorrowModal(false);
    setBorrowQty('1');
    setBorrowDueDate('');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {showBorrowModal && (
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
                <div className="text-sm text-gray-600">{book?.title}</div>
                <div className="text-xs text-gray-500">Available copies: {book?.copies}</div>
              </div>

              <div>
                <label htmlFor="borrow-qty" className="mb-2 block text-sm font-medium text-gray-900">Quantity</label>
                <input
                  id="borrow-qty"
                  type="number"
                  min={1}
                  max={Number(book?.copies) || 0}
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
      <div className='w-[80%] mx-auto'>
        <div className="bg-white rounded-lg border-gray-200 border-[0.2px] drop-shadow-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="">
            {book?.bookCover ? (
              <img
                src={book.bookCover}
                alt={book.title}
                className=" rounded-lg"
              />
            ) : (
              <div className="rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                No Cover
              </div>
            )}
          </div>

          <div className=" space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book?.title}</h1>
              <p className="text-gray-600">Author: <span className='text-black'>{book?.author}</span></p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{book?.description}</p>
            </div>

            <div className="space-y-2">
              <div className="text-gray-600">
                <span className="font-medium">Genre:</span> {book?.genre}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">ISBN:</span> {book?.isbn}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Copies:</span> {book?.copies}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Availability:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${Number(book?.copies) >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {Number(book?.copies) >= 1 ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleBorrow}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Borrow Now
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default BookDetail;
