
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-white no-underline text-2xl font-bold">
          Library Management
        </Link>
      </div>
      
      <div className="flex gap-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            ` duration-300 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/books" 
          className={({ isActive }) => 
            ` duration-300 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`
          }
        >
          Books
        </NavLink>
        <NavLink 
          to="/create-book" 
          className={({ isActive }) => 
            ` duration-300 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`
          }
        >
          Add Book
        </NavLink>
        <NavLink 
          to="/borrow-summary" 
          className={({ isActive }) => 
            ` duration-300 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`
          }
        >
          Borrow Summary
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;