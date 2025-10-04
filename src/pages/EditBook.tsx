import { useParams } from 'react-router-dom';

function EditBook() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Edit Book</h1>
      <p>Book ID: {id}</p>
    </div>
  );
}

export default EditBook;
