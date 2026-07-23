import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = { email: 'admin@agrimadeeazy.com', password: 'admin123' };
const DEMO_USER = { email: 'user@agrimadeeazy.com', password: 'user123' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrimadeeazy-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrimadeeazy-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrimadeeazy-user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({
        id: 'admin-1', name: 'Admin User', email, role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=68',
      });
      return { success: true, message: 'Welcome back, Admin!' };
    }
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      setUser({
        id: 'user-1', name: 'Demo Farmer', email, role: 'user', phone: '9876543210',
        avatar: 'https://i.pravatar.cc/150?img=33',
        address: '123 Farm Road', city: 'Hyderabad', state: 'Telangana', pincode: '500001',
      });
      return { success: true, message: 'Welcome back!' };
    }
    const registered = localStorage.getItem(`agrimadeeazy-reg-${email}`);
    if (registered) {
      const data = JSON.parse(registered);
      if (data.password === password) {
        setUser({ id: data.id, name: data.name, email, role: 'user', avatar: `https://i.pravatar.cc/150?u=${email}` });
        return { success: true, message: 'Welcome back!' };
      }
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const existing = localStorage.getItem(`agrimadeeazy-reg-${email}`);
    if (existing) return { success: false, message: 'Account already exists with this email' };
    const id = `user-${Date.now()}`;
    localStorage.setItem(`agrimadeeazy-reg-${email}`, JSON.stringify({ id, name, email, password }));
    setUser({ id, name, email, role: 'user', avatar: `https://i.pravatar.cc/150?u=${email}` });
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!user) return { success: false, message: 'Not logged in' };
    const reg = localStorage.getItem(`agrimadeeazy-reg-${user.email}`);
    if (reg) {
      const data = JSON.parse(reg);
      if (data.password !== currentPassword) return { success: false, message: 'Current password is incorrect' };
      localStorage.setItem(`agrimadeeazy-reg-${user.email}`, JSON.stringify({ ...data, password: newPassword }));
    }
    return { success: true, message: 'Password changed successfully' };
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
