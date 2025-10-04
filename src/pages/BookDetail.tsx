import { useParams } from 'react-router-dom';

function BookDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Book Details</h1>
      <p>Book ID: {id}</p>
    </div>
  );
}

export default BookDetail;
