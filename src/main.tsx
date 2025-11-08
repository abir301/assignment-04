import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BooksList from './pages/Books';
import CreateBook from './pages/CreateBook';
import BookDetail from './pages/BookDetail';
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
        path: "/book/:id",
        element: <BookDetail />,
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
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  </StrictMode>
);
