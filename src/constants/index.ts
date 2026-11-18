import type { IconName, Modalidade, Perfil, PostType, Tone } from '../types';

interface Category {
  key: string;
  icon: IconName;
  color: string;
}

export const CATEGORIES: Category[] = [
  { key: 'Tecnologia', icon: 'code-slash', color: '#5B4DF0' },
  { key: 'Ofícios', icon: 'hammer-outline', color: '#EA6A0A' },
  { key: 'Negócios', icon: 'briefcase-outline', color: '#0E8F8E' },
  { key: 'Idiomas', icon: 'language-outline', color: '#D6317F' },
  { key: 'Educação Básica', icon: 'book-outline', color: '#2F6FE0' },
  { key: 'Inclusão Digital', icon: 'phone-portrait-outline', color: '#8B4FE0' },
];

export const categoryOf = (key: string): Category =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

export const MODALIDADES: Modalidade[] = ['Presencial', 'Online', 'Híbrido'];

interface PostTypeInfo {
  key: PostType;
  label: string;
  icon: IconName;
  tone: Tone;
}

export const POST_TYPES: PostTypeInfo[] = [
  { key: 'conquista', label: 'Conquista', icon: 'trophy-outline', tone: 'success' },
  { key: 'vaga', label: 'Vaga', icon: 'megaphone-outline', tone: 'primary' },
  { key: 'dica', label: 'Dica', icon: 'bulb-outline', tone: 'warn' },
  { key: 'duvida', label: 'Dúvida', icon: 'help-circle-outline', tone: 'accent' },
];

export const postTypeOf = (key: string): PostTypeInfo =>
  POST_TYPES.find((p) => p.key === key) ?? POST_TYPES[2];

/** Avatares desenhados que a pessoa pode escolher no cadastro e no perfil. */
interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  /** cor de fundo do círculo */
  color: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'estudante', emoji: '👩🏽‍🎓', label: 'Estudante', color: '#E3DFFF' },
  { id: 'programador', emoji: '👨🏾‍💻', label: 'Programador', color: '#CFF1EC' },
  { id: 'tecnica', emoji: '👩🏻‍🔧', label: 'Técnica', color: '#FDE9B8' },
  { id: 'professor', emoji: '🧑🏿‍🏫', label: 'Professor', color: '#D3F0DD' },
  { id: 'cozinheiro', emoji: '👨🏼‍🍳', label: 'Cozinheiro', color: '#FBD9E1' },
  { id: 'executiva', emoji: '👩🏾‍💼', label: 'Executiva', color: '#D5E5FF' },
  { id: 'artista', emoji: '🧑🏽‍🎨', label: 'Artista', color: '#F8DAEF' },
  { id: 'cientista', emoji: '👨🏻‍🔬', label: 'Cientista', color: '#D6EEF8' },
  { id: 'agricultora', emoji: '👩🏿‍🌾', label: 'Agricultora', color: '#DDEBC8' },
  { id: 'mecanico', emoji: '👨🏽‍🔧', label: 'Mecânico', color: '#FFE0C7' },
  { id: 'senhora', emoji: '👵🏼', label: 'Senhora', color: '#EADCF7' },
  { id: 'senhor', emoji: '👴🏾', label: 'Senhor', color: '#DCE3EA' },
  { id: 'raposa', emoji: '🦊', label: 'Raposa', color: '#FFE0C7' },
  { id: 'coruja', emoji: '🦉', label: 'Coruja', color: '#E9DFD2' },
  { id: 'foguete', emoji: '🚀', label: 'Foguete', color: '#D5E5FF' },
  { id: 'livros', emoji: '📚', label: 'Livros', color: '#D3F0DD' },
];

export const DEFAULT_AVATAR = AVATARS[0].id;

export const avatarOf = (id?: string | null): AvatarOption | undefined =>
  id ? AVATARS.find((a) => a.id === id) : undefined;

interface PerfilInfo {
  key: Perfil;
  label: string;
  desc: string;
}

export const PERFIS: Record<Perfil, PerfilInfo> = {
  cidadao: { key: 'cidadao', label: 'Cidadão', desc: 'Quero aprender e me qualificar' },
  agente: { key: 'agente', label: 'Agente', desc: 'Organizo projetos e pontos de aprendizagem' },
};
