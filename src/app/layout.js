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
  <header className="app-header">
    <div className="header-content">
      <div className="brand">
        <div className="logo">F</div>
        <h1 className="title">Fashion Inventory</h1>
      </div>
      <nav className="nav-links">
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
      <p>© 2025 Fashion Inventory System. All rights reserved.</p>
    </div>
  </footer>
);