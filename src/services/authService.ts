// Contas e sessão, salvas no AsyncStorage.
import type { NewUser, ProfilePatch, Post, User, UserWithPassword } from '../types';
import { uid } from '../utils/format';
import { KEYS, load, loadArray, remove, save } from './storage';

// Obs.: projeto acadêmico — a senha fica em texto puro no aparelho.
// Em produção seria usado um backend com hash e token.

/** Tira a senha antes de entregar o usuário para a interface. */
function publicUser(user: UserWithPassword): User {
  const { senha, ...rest } = user;
  return rest;
}

export const listUsers = (): Promise<UserWithPassword[]> => loadArray<UserWithPassword>(KEYS.users);

export const saveUsers = (users: UserWithPassword[]): Promise<void> => save(KEYS.users, users);

export async function register(data: NewUser): Promise<User> {
  const users = await listUsers();
  const email = data.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) {
    throw new Error('Este e-mail já está cadastrado.');
  }
  const user: UserWithPassword = { ...data, email, id: uid(), createdAt: Date.now() };
  await saveUsers([...users, user]);
  await save(KEYS.session, user.id);
  return publicUser(user);
}

export async function login(email: string, senha: string): Promise<User> {
  const users = await listUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase() && u.senha === senha);
  if (!user) throw new Error('E-mail ou senha incorretos.');
  await save(KEYS.session, user.id);
  return publicUser(user);
}

export async function getSessionUser(): Promise<User | null> {
  const id = await load<string | null>(KEYS.session, null);
  if (!id) return null;
  const user = (await listUsers()).find((u) => u.id === id);
  return user ? publicUser(user) : null;
}

export async function logout(): Promise<void> {
  await remove(KEYS.session);
}

export async function updateUser(id: string, patch: ProfilePatch): Promise<User> {
  const users = await listUsers();
  const current = users.find((u) => u.id === id);
  if (!current) throw new Error('Usuário não encontrado.');

  const updated: UserWithPassword = {
    ...current,
    nome: patch.nome.trim(),
    telefone: patch.telefone,
    cidade: patch.cidade.trim(),
    organizacao: patch.organizacao ?? null,
    avatar: patch.avatar ?? null,
    endereco: patch.endereco?.trim() || null,
    interesses: patch.interesses,
  };
  await saveUsers(users.map((u) => (u.id === id ? updated : u)));

  // as publicações guardam nome e avatar do autor: mantém em dia com o perfil
  const posts = await loadArray<Post>(KEYS.posts);
  if (posts.some((p) => p.autorId === id)) {
    await save(
      KEYS.posts,
      posts.map((p) =>
        p.autorId === id ? { ...p, autorNome: updated.nome, autorAvatar: updated.avatar } : p
      )
    );
  }

  return publicUser(updated);
}
