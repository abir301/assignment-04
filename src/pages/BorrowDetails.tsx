import { useParams } from 'react-router-dom';

function BorrowDetails() {
  const { bookId } = useParams<{ bookId: string }>();

  return (
    <div>
      <h1>Borrow Book</h1>
      <p>Book ID: {bookId}</p>
    </div>
  );
}

export default BorrowDetails;
