import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import Avatar from './Avatar';
import Badge from './Badge';
import useThemedStyles from '../hooks/useThemedStyles';
import { useTheme } from '../context/SettingsContext';
import { postCardStyles } from '../styles/components.styles';
import { postTypeOf } from '../constants';
import { timeAgo } from '../utils/format';
import type { Post, Project } from '../types';

type Props = {
  post: Post;
  /** projeto marcado na publicação, se houver */
  project?: Project;
  userId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, texto: string) => void;
  onOpenProject: (projectId: string) => void;
};

export default function PostCard({
  post,
  project,
  userId,
  onLike,
  onComment,
  onOpenProject,
}: Props) {
  const s = useThemedStyles(postCardStyles);
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const type = postTypeOf(post.tipo);
  const liked = post.curtidas.includes(userId);

  const send = () => {
    const txt = draft.trim();
    if (!txt) return;
    onComment(post.id, txt);
    setDraft('');
  };

  return (
    <Card>
      <View style={s.head}>
        <Avatar name={post.autorNome} avatar={post.autorAvatar} />
        <View style={s.who}>
          <Text style={s.name}>{post.autorNome}</Text>
          <Text style={s.sub}>
            {post.perfil === 'agente' ? 'Agente' : 'Cidadão'} · {timeAgo(post.criadoEm)}
          </Text>
        </View>
        <Badge text={type.label} tone={type.tone} icon={type.icon} />
      </View>

      <Text style={s.body}>{post.texto}</Text>

      {project ? (
        <Pressable
          onPress={() => onOpenProject(project.id)}
          accessibilityRole="button"
          accessibilityLabel={`Projeto citado: ${project.titulo}`}
          style={s.project}
        >
          <Ionicons name="school-outline" size={20} color={t.tones.primary.fg} />
          <Text style={s.projectText} numberOfLines={1}>
            {project.titulo}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} />
        </Pressable>
      ) : null}

      <View style={s.actions}>
        <Pressable
          onPress={() => onLike(post.id)}
          accessibilityRole="button"
          accessibilityLabel={`${liked ? 'Descurtir' : 'Curtir'}. ${post.curtidas.length} curtidas`}
          accessibilityState={{ selected: liked }}
          style={s.action}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? t.tones.danger.fg : t.colors.textMuted}
          />
          <Text style={[s.actionText, liked && { color: t.tones.danger.fg }]}>
            {post.curtidas.length}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityLabel={`Comentários. ${post.comentarios.length}`}
          accessibilityState={{ expanded: open }}
          style={s.action}
        >
          <Ionicons name="chatbubble-outline" size={20} color={t.colors.textMuted} />
          <Text style={s.actionText}>{post.comentarios.length}</Text>
        </Pressable>
      </View>

      {open ? (
        <View style={s.comments}>
          {post.comentarios.map((c) => (
            <View key={c.id} style={s.comment}>
              <Text style={s.commentAuthor}>{c.autorNome}</Text>
              <Text style={s.commentText}>{c.texto}</Text>
            </View>
          ))}
          <View style={s.composer}>
            <TextInput
              style={s.composerInput}
              value={draft}
              onChangeText={setDraft}
              placeholder="Escreva um comentário"
              placeholderTextColor={t.colors.textMuted}
              accessibilityLabel="Escreva um comentário"
              maxLength={200}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Pressable
              onPress={send}
              accessibilityRole="button"
              accessibilityLabel="Enviar comentário"
              style={s.send}
            >
              <Ionicons name="send" size={18} color={t.colors.onPrimary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </Card>
  );
}
