import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-800/50 text-white p-4 flex justify-center gap-8 fixed top-0 left-0 w-full z-50 rounded-b-2xl shadow-md">
      <Link to="/" className="hover:text-blue-400 font-semibold">Home</Link>
      <Link to="/dashboard" className="hover:text-blue-400 font-semibold">Dashboard</Link>
      <Link to="/history" className="hover:text-blue-400 font-semibold">History</Link>
    </nav>
  );
};

export default Navbar;
