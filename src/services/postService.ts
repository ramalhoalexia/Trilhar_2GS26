// Publicações da comunidade (com curtidas e comentários), salvas no AsyncStorage.
import type { NewPost, Post } from '../types';
import { uid } from '../utils/format';
import { KEYS, loadArray, save } from './storage';

export const listPosts = (): Promise<Post[]> => loadArray<Post>(KEYS.posts);

export const savePosts = (posts: Post[]): Promise<void> => save(KEYS.posts, posts);

export async function addPost(data: NewPost): Promise<void> {
  const post: Post = { ...data, id: uid(), curtidas: [], comentarios: [], criadoEm: Date.now() };
  await savePosts([post, ...(await listPosts())]);
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  const posts = await listPosts();
  await savePosts(
    posts.map((post) => {
      if (post.id !== postId) return post;
      const curtido = post.curtidas.includes(userId);
      return {
        ...post,
        curtidas: curtido
          ? post.curtidas.filter((id) => id !== userId)
          : [...post.curtidas, userId],
      };
    })
  );
}

export async function addComment(
  postId: string,
  autorNome: string,
  texto: string
): Promise<void> {
  const posts = await listPosts();
  await savePosts(
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comentarios: [
              ...post.comentarios,
              { id: uid(), autorNome, texto, criadoEm: Date.now() },
            ],
          }
        : post
    )
  );
}
