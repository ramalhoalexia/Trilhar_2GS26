// Carga inicial e atualizações dos dados guardados no aparelho.
import { api } from '../api/mockApi';
import { DEMO_ENROLLMENTS, DEMO_USERS, MOCK_POSTS, MOCK_PROJECTS } from '../api/mocks';
import type { Post, Project, UserWithPassword } from '../types';
import { listUsers, saveUsers } from './authService';
import { listPosts, savePosts } from './postService';
import { saveHubs } from './hubService';
import { listProjects, saveEnrollments, saveProjects } from './projectService';
import { KEYS, load, remove, save } from './storage';

/** Sobe de 1 para 2 quando o app passou a ter avatar e endereço. */
const DATA_VERSION = 2;

/** Chave usada pela primeira versão do app, antes de existir controle de versão. */
const CHAVE_ANTIGA = '@trilhar:seeded:v1';

/** Primeira execução: consulta a API (mock) e grava tudo no AsyncStorage. */
async function seedFromApi(): Promise<void> {
  const [projects, posts, hubs] = await Promise.all([
    api.getProjects(),
    api.getPosts(),
    api.getHubs(),
  ]);
  const now = Date.now();
  await Promise.all([
    saveUsers(DEMO_USERS),
    saveProjects(projects.map((p, index) => ({ ...p, criadoEm: now - index }))),
    saveEnrollments(DEMO_ENROLLMENTS),
    savePosts(posts),
    saveHubs(hubs),
    // a primeira versão do app guardava outro formato nestas chaves
    save(KEYS.readings, {}),
    save(KEYS.alerts, []),
    save(KEYS.reservations, []),
    remove(CHAVE_ANTIGA),
  ]);
}

/** Quem já tinha o app instalado recebe os avatares e endereços de exemplo. */
async function backfillAvatarsAndAddresses(): Promise<void> {
  const [users, projects, posts] = await Promise.all([listUsers(), listProjects(), listPosts()]);

  const demoUser = (id: string) => DEMO_USERS.find((u) => u.id === id);
  const nextUsers: UserWithPassword[] = users.map((user) => ({
    ...user,
    avatar: user.avatar ?? demoUser(user.id)?.avatar ?? null,
    endereco: user.endereco ?? demoUser(user.id)?.endereco ?? null,
  }));

  const nextProjects: Project[] = projects.map((project) => ({
    ...project,
    endereco: project.endereco ?? MOCK_PROJECTS.find((p) => p.id === project.id)?.endereco ?? null,
  }));

  const nextPosts: Post[] = posts.map((post) => ({
    ...post,
    autorAvatar:
      post.autorAvatar ??
      MOCK_POSTS.find((p) => p.id === post.id)?.autorAvatar ??
      demoUser(post.autorId)?.avatar ??
      null,
  }));

  await Promise.all([saveUsers(nextUsers), saveProjects(nextProjects), savePosts(nextPosts)]);
}

/**
 * Prepara os dados antes de o app abrir: faz a carga inicial na primeira
 * execução e aplica as atualizações nas versões seguintes.
 */
export async function ensureSeed(): Promise<void> {
  const version = await load<number>(KEYS.version, 0);
  if (version >= DATA_VERSION) return;

  if (version === 0) await seedFromApi();
  else if (version < 2) await backfillAvatarsAndAddresses();

  await save(KEYS.version, DATA_VERSION);
}
