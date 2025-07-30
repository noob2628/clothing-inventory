// src/app/layout.js
import './globals.css';
import Head from 'next/head';
import SearchBar from './components/SearchBar';

export const metadata = {
  title: 'Fashion Inventory',
  description: 'Premium clothing management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Head content moved to _document.js for custom fonts */}
      </Head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}

const Header = () => (
  <header className="bg-white shadow-sm py-4">
    <div className="container flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <h1 className="text-2xl font-bold">Fashion Inventory</h1>
      </div>
      <SearchBar />
      <nav className="flex space-x-6">
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/create">Add Product</NavLink>
      </nav>
    </div>
  </header>
);

const NavLink = ({ href, children }) => (
  <a href={href} className="font-medium hover:text-accent transition-colors">
    {children}
  </a>
);

const Footer = () => (
  <footer className="bg-primary text-white py-8 mt-12">
    <div className="container text-center">
      <p>© 2023 Fashion Inventory System. All rights reserved.</p>
    </div>
  </footer>
);