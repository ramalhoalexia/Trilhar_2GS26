// Projetos e inscrições, salvos no AsyncStorage.
import { api } from '../api/mockApi';
import type { Enrollment, NewProject, Project } from '../types';
import { uid } from '../utils/format';
import { KEYS, loadArray, save } from './storage';

export const listProjects = (): Promise<Project[]> => loadArray<Project>(KEYS.projects);

export const saveProjects = (projects: Project[]): Promise<void> => save(KEYS.projects, projects);

export async function createProject(data: NewProject): Promise<Project> {
  const project: Project = { ...data, id: uid(), inscritos: 0, criadoEm: Date.now() };
  await saveProjects([project, ...(await listProjects())]);
  return project;
}

/** Consulta a API e grava os projetos que ainda não existem no aparelho. */
export async function syncProjectsFromApi(): Promise<number> {
  const [remote, saved] = await Promise.all([api.getProjects(), listProjects()]);
  const now = Date.now();
  const novos = remote
    .filter((p) => !saved.some((s) => s.id === p.id))
    .map((p, index) => ({ ...p, criadoEm: now - index }));
  if (novos.length) await saveProjects([...novos, ...saved]);
  return novos.length;
}

// ---------- Inscrições ----------

const listEnrollments = (): Promise<Enrollment[]> => loadArray<Enrollment>(KEYS.enrollments);

export const saveEnrollments = (enrollments: Enrollment[]): Promise<void> =>
  save(KEYS.enrollments, enrollments);

export async function listEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
  const enrollments = await listEnrollments();
  return enrollments.filter((e) => e.userId === userId).sort((a, b) => b.criadoEm - a.criadoEm);
}

export async function enroll(userId: string, projectId: string): Promise<void> {
  const [projects, enrollments] = await Promise.all([listProjects(), listEnrollments()]);
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error('Projeto não encontrado.');
  if (enrollments.some((e) => e.userId === userId && e.projectId === projectId)) {
    throw new Error('Você já está inscrito neste projeto.');
  }
  if (project.inscritos >= project.vagas) throw new Error('Não há mais vagas neste projeto.');

  await Promise.all([
    saveEnrollments([
      ...enrollments,
      { id: uid(), userId, projectId, progresso: 0, criadoEm: Date.now() },
    ]),
    saveProjects(
      projects.map((p) => (p.id === projectId ? { ...p, inscritos: p.inscritos + 1 } : p))
    ),
  ]);
}

export async function unenroll(userId: string, projectId: string): Promise<void> {
  const [projects, enrollments] = await Promise.all([listProjects(), listEnrollments()]);
  const restantes = enrollments.filter(
    (e) => !(e.userId === userId && e.projectId === projectId)
  );
  if (restantes.length === enrollments.length) return;

  await Promise.all([
    saveEnrollments(restantes),
    saveProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, inscritos: Math.max(0, p.inscritos - 1) } : p
      )
    ),
  ]);
}

export async function setProgress(
  userId: string,
  projectId: string,
  progresso: number
): Promise<void> {
  const enrollments = await listEnrollments();
  await saveEnrollments(
    enrollments.map((e) =>
      e.userId === userId && e.projectId === projectId
        ? { ...e, progresso: Math.max(0, Math.min(100, Math.round(progresso))) }
        : e
    )
  );
}
