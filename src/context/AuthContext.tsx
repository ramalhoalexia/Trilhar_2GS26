import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authService from '../services/authService';
import { ensureSeed } from '../services/seedService';
import type { NewUser, ProfilePatch, User } from '../types';

interface AuthValue {
  /** usuário logado (null quando não há sessão) */
  user: User | null;
  /** último usuário logado: evita telas quebrando durante a animação de saída */
  lastUser: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (data: NewUser) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lastUser, setLastUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setLogged = useCallback((next: User) => {
    setUser(next);
    setLastUser(next);
  }, []);

  // prepara os dados salvos e restaura a sessão
  useEffect(() => {
    let active = true;
    (async () => {
      await ensureSeed();
      const saved = await authService.getSessionUser();
      if (!active) return;
      if (saved) setLogged(saved);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [setLogged]);

  const signIn = useCallback(
    async (email: string, senha: string) => setLogged(await authService.login(email, senha)),
    [setLogged]
  );

  const signUp = useCallback(
    async (data: NewUser) => setLogged(await authService.register(data)),
    [setLogged]
  );

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!user) return;
      setLogged(await authService.updateUser(user.id, patch));
    },
    [user, setLogged]
  );

  const value = useMemo(
    () => ({ user, lastUser, loading, signIn, signUp, signOut, updateProfile }),
    [user, lastUser, loading, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}

/** Para telas protegidas, onde sempre existe um usuário logado. */
export function useCurrentUser(): User {
  const { user, lastUser } = useAuth();
  const current = user ?? lastUser;
  if (!current) throw new Error('Esta tela exige um usuário logado.');
  return current;
}
