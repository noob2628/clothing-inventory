// src/app/layout.js
export const metadata = {
  title: 'Clothing Inventory',
  description: 'Manage your product catalog',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
