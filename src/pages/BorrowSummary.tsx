import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBorrowedBooks, selectBorrowedBooks, selectLoading, selectError } from '../redux/booksSlice';

function BorrowSummary() {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8 h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrowed Books Summary</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading borrowed books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrowed Books Summary</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading borrowed books</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrowed Books Summary</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Quantity Borrowed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {borrowedBooks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500"> 
                  No borrowed books found
                </td>
              </tr>
            ) : (
              borrowedBooks.map((borrow, index) => (
                <tr key={borrow._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className=" text-gray-900">{borrow.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className=" text-gray-900">{borrow.isbn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className=" text-gray-900">{borrow.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className=" text-gray-900">{formatDate(borrow.dueDate)}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BorrowSummary;
