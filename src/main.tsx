import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BooksList from './pages/Books';
import CreateBook from './pages/CreateBook';
import BookDetail from './pages/BookDetail';
import EditBook from './pages/EditBook';
import BorrowBook from './pages/BorrowDetails';
import BorrowSummary from './pages/BorrowSummary';
import Home from './Home';
import HomeContent from './HomeContent/Homecontent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <HomeContent/>,
      },
      {
        path: "/books",
        element: <BooksList />,
      },
      {
        path: "/create-book",
        element: <CreateBook />,
      },
      {
        path: "/books/:id",
        element: <BookDetail />,
      },
      {
        path: "/edit-book/:id",
        element: <EditBook />,
      },
      {
        path: "/borrow/:bookId",
        element: <BorrowBook />,
      },
      {
        path: "/borrow-summary",
        element: <BorrowSummary />,
      },
    ],
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <RouterProvider router={router} />
  </StrictMode>
);
