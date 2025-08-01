// src/app/layout.js
import './globals.css';
import Head from 'next/head';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Kily Clothing Inventory',
  description: 'Premium clothing management system',
};


const NavLink = ({ href, children }) => (
  <a href={href} className="font-medium hover:text-accent transition-colors">
    {children}
  </a>
);

const Footer = () => (
  <footer className="bg-primary text-white py-8 mt-12">
    <div className="container text-center">
      <p>© 2025 Kily Clothing Inventory System. All rights reserved.</p>
    </div>
  </footer>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Head>
        <link rel="icon" href="/kily.ph.webp" />
      </Head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}