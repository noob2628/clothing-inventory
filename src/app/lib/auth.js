//src/app/lib/auth.js
// Simple in-memory authentication (client-side only)
export const users = [
  {
    username: "user",
    password: "Temp123*",
    role: "USER"
  },
  {
    username: "admin",
    password: "Temp123*",
    role: "ADMIN"
  }
];

export const authenticate = (username, password) => {
  return users.find(
    user => user.username === username && user.password === password
  );
};

// Client-side only functions
export const getUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole') || 'USER';
  }
  return 'USER'; // Default for SSR
};

export const setUserSession = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('username', user.username);
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  }
};