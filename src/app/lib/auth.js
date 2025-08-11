//src/app/lib/auth.js
// Client-side only functions
export const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
};

export const getUsername = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('username');
};

export const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
};

export const setUserSession = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userId', user.id);
    // Trigger event to update UI
    window.dispatchEvent(new Event('authChange'));
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    clearUserSession();
    // Trigger event to update UI
    window.dispatchEvent(new Event('authChange'));
  }
};

export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }
};

