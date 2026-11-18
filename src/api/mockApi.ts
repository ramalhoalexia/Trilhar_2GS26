// API simulada da CitizenTech.
// Cada função imita uma chamada HTTP (GET) com latência de rede e devolve JSON.
// Para usar um backend real basta trocar o corpo de `request` por `fetch(BASE_URL + path)`.
import type { ApiProject, Hub, Post } from '../types';
import { MOCK_HUBS, MOCK_POSTS, MOCK_PROJECTS } from './mocks';

const LATENCY_MS = 350;

const ROUTES = {
  '/projects': MOCK_PROJECTS,
  '/posts': MOCK_POSTS,
  '/hubs': MOCK_HUBS,
} as const;

function request<T>(path: keyof typeof ROUTES): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // serializa e desserializa para se comportar como uma resposta JSON de verdade
      resolve(JSON.parse(JSON.stringify(ROUTES[path])) as T);
    }, LATENCY_MS);
  });
}

export const api = {
  getProjects: () => request<ApiProject[]>('/projects'),
  getPosts: () => request<Post[]>('/posts'),
  getHubs: () => request<Hub[]>('/hubs'),
};
