import { User } from "@shared/schema";

// These functions are just placeholders to maintain compatibility with existing code
// The actual authentication is handled by the useAuth hook

// Sign in with credentials (username/password)
export const signInWithCredentials = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign in as guest (disabled in server auth system, just a dummy function)
export const signInAsGuest = async () => {
  try {
    console.warn("Guest login is not implemented with server authentication");
    throw new Error("Guest login is not implemented");
  } catch (error) {
    console.error("Error signing in as guest:", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Logout failed');
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state listener (dummy function, use useAuth hook instead)
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.warn("Auth state listener is not needed with server authentication");
  return () => {}; // Return a cleanup function
};
