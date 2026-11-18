import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import * as postService from '../services/postService';
import * as projectService from '../services/projectService';
import type { Enrollment, NewProject, Post, PostType, Project } from '../types';

interface PostInput {
  texto: string;
  tipo: PostType;
  projetoId: string | null;
}

interface DataValue {
  projects: Project[];
  posts: Post[];
  myEnrollments: Enrollment[];
  createProject: (data: NewProject) => Promise<Project>;
  /** consulta a API e grava os projetos novos; devolve quantos entraram */
  syncProjects: () => Promise<number>;
  enroll: (projectId: string) => Promise<void>;
  unenroll: (projectId: string) => Promise<void>;
  setProgress: (projectId: string, value: number) => Promise<void>;
  createPost: (input: PostInput) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, texto: string) => Promise<void>;
}

const DataContext = createContext<DataValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);

  const reloadProjects = useCallback(async () => setProjects(await projectService.listProjects()), []);
  const reloadPosts = useCallback(async () => setPosts(await postService.listPosts()), []);
  const reloadEnrollments = useCallback(
    async (userId: string) => setMyEnrollments(await projectService.listEnrollmentsByUser(userId)),
    []
  );

  // lê os dados salvos sempre que um usuário entra
  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    (async () => {
      const [savedProjects, savedPosts, savedEnrollments] = await Promise.all([
        projectService.listProjects(),
        postService.listPosts(),
        projectService.listEnrollmentsByUser(user.id),
      ]);
      if (!active) return;
      setProjects(savedProjects);
      setPosts(savedPosts);
      setMyEnrollments(savedEnrollments);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const createProject = useCallback(
    async (data: NewProject) => {
      const project = await projectService.createProject(data);
      await reloadProjects();
      return project;
    },
    [reloadProjects]
  );

  const syncProjects = useCallback(async () => {
    const added = await projectService.syncProjectsFromApi();
    await reloadProjects();
    return added;
  }, [reloadProjects]);

  const enroll = useCallback(
    async (projectId: string) => {
      if (!user) return;
      await projectService.enroll(user.id, projectId);
      await Promise.all([reloadProjects(), reloadEnrollments(user.id)]);
    },
    [user, reloadProjects, reloadEnrollments]
  );

  const unenroll = useCallback(
    async (projectId: string) => {
      if (!user) return;
      await projectService.unenroll(user.id, projectId);
      await Promise.all([reloadProjects(), reloadEnrollments(user.id)]);
    },
    [user, reloadProjects, reloadEnrollments]
  );

  const setProgress = useCallback(
    async (projectId: string, value: number) => {
      if (!user) return;
      await projectService.setProgress(user.id, projectId, value);
      await reloadEnrollments(user.id);
    },
    [user, reloadEnrollments]
  );

  const createPost = useCallback(
    async ({ texto, tipo, projetoId }: PostInput) => {
      if (!user) return;
      await postService.addPost({
        autorId: user.id,
        autorNome: user.nome,
        autorAvatar: user.avatar ?? null,
        perfil: user.perfil,
        texto: texto.trim(),
        tipo,
        projetoId,
      });
      await reloadPosts();
    },
    [user, reloadPosts]
  );

  const toggleLike = useCallback(
    async (postId: string) => {
      if (!user) return;
      await postService.toggleLike(postId, user.id);
      await reloadPosts();
    },
    [user, reloadPosts]
  );

  const addComment = useCallback(
    async (postId: string, texto: string) => {
      if (!user) return;
      await postService.addComment(postId, user.nome, texto);
      await reloadPosts();
    },
    [user, reloadPosts]
  );

  const value = useMemo(
    () => ({
      projects,
      posts,
      myEnrollments: user ? myEnrollments : [],
      createProject,
      syncProjects,
      enroll,
      unenroll,
      setProgress,
      createPost,
      toggleLike,
      addComment,
    }),
    [
      projects,
      posts,
      myEnrollments,
      user,
      createProject,
      syncProjects,
      enroll,
      unenroll,
      setProgress,
      createPost,
      toggleLike,
      addComment,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData precisa estar dentro de <DataProvider>.');
  return ctx;
}
