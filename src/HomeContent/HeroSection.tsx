import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div 
      className="relative h-screen flex items-center justify-center text-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 text-white max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Step Into a World of Books</h1>
        <p className="text-xl mb-8 text-gray-300">
          Search the shelves, pick your next story, and start reading today.
        </p>
        <Link 
          to="/create-book" 
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 text-lg"
        >
          Add Books
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
