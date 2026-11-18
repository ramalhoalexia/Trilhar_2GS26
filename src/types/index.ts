import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Tone = 'primary' | 'success' | 'warn' | 'danger' | 'accent' | 'neutral';
export type Perfil = 'cidadao' | 'agente';
export type Modalidade = 'Presencial' | 'Online' | 'Híbrido';
export type PostType = 'conquista' | 'vaga' | 'dica' | 'duvida';

// ---------- Usuários ----------
export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cidade: string;
  perfil: Perfil;
  organizacao?: string | null;
  /** id de um dos avatares desenhados (ver AVATARS em constants) */
  avatar?: string | null;
  /** rua, número e bairro (opcional) */
  endereco?: string | null;
  interesses: string[];
  createdAt: number;
}

export interface UserWithPassword extends User {
  senha: string;
}

export type NewUser = Omit<UserWithPassword, 'id' | 'createdAt'>;

export type ProfilePatch = Pick<User, 'nome' | 'telefone' | 'cidade' | 'interesses'> & {
  organizacao?: string | null;
  avatar?: string | null;
  endereco?: string | null;
};

// ---------- Projetos ----------
export interface Project {
  id: string;
  titulo: string;
  organizacao: string;
  categoria: string;
  modalidade: Modalidade;
  cidade: string;
  /** onde as aulas acontecem (só para projetos presenciais ou híbridos) */
  endereco?: string | null;
  descricao: string;
  cargaHoraria: number;
  vagas: number;
  inscritos: number;
  inicio: string; // AAAA-MM-DD
  certificado: boolean;
  nivel: string;
  contato: string;
  autorId: string;
  tags: string[];
  criadoEm: number;
}

/** Formato devolvido pela API (o app define `criadoEm` ao salvar no aparelho). */
export type ApiProject = Omit<Project, 'criadoEm'>;
export type NewProject = Omit<Project, 'id' | 'inscritos' | 'criadoEm'>;

export interface Enrollment {
  id: string;
  userId: string;
  projectId: string;
  progresso: number;
  criadoEm: number;
}

// ---------- Comunidade ----------
interface Comment {
  id: string;
  autorNome: string;
  texto: string;
  criadoEm: number;
}

export interface Post {
  id: string;
  autorId: string;
  autorNome: string;
  autorAvatar?: string | null;
  perfil: Perfil;
  tipo: PostType;
  texto: string;
  projetoId: string | null;
  curtidas: string[];
  comentarios: Comment[];
  criadoEm: number;
}

export type NewPost = Pick<
  Post,
  'autorId' | 'autorNome' | 'autorAvatar' | 'perfil' | 'tipo' | 'texto' | 'projetoId'
>;

// ---------- IoT (pontos de aprendizagem) ----------
export interface Hub {
  id: string;
  nome: string;
  bairro: string;
  capacidade: number;
  baseWifi: number;
  baseTemp: number;
  ocupacaoInicial: number;
}

export interface Reading {
  ocupacao: number;
  wifi: number;
  temp: number;
  /** leituras restantes de uma queda de Wi-Fi em andamento */
  dip: number;
  ts: number;
}

export interface HubStatus {
  key: 'livre' | 'moderado' | 'lotado' | 'instavel';
  label: string;
  tone: Tone;
}

export interface LiveHub extends Hub {
  reading: Reading;
  status: HubStatus;
  reservas: number;
}

export type AlertType = 'conexao' | 'lotacao' | 'temperatura';
export type AlertStatus = 'aberto' | 'em_atendimento' | 'normalizado';

export interface SensorAlert {
  id: string;
  hubId: string;
  hubNome: string;
  tipo: AlertType;
  severidade: Extract<Tone, 'danger' | 'warn'>;
  titulo: string;
  detalhe: string;
  status: AlertStatus;
  criadoEm: number;
  normalizadoEm?: number | null;
  acionadoPor?: string | null;
}

export interface Reservation {
  id: string;
  hubId: string;
  userId: string;
  criadoEm: number;
}
