import { StyleSheet } from 'react-native';
import type { Theme } from './theme';

export const screenStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.bg },
    content: { padding: t.spacing.lg, paddingBottom: 120 },
  });

export const headerStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.lg,
      paddingTop: t.spacing.md,
      paddingBottom: t.spacing.sm,
    },
    logo: { marginRight: t.spacing.md },
    texts: { flex: 1, paddingRight: t.spacing.sm },
    title: { fontSize: t.fs(28), fontWeight: '800', color: t.colors.text, letterSpacing: -0.6 },
    subtitle: { fontSize: t.fs(14), color: t.colors.textMuted, marginTop: 2 },
  });

export const buttonStyles = (t: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: 52,
      borderRadius: t.radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 8,
      borderWidth: t.borderWidth,
      borderColor: 'transparent',
    },
    small: { minHeight: 44, paddingHorizontal: 16 },
    primary: { backgroundColor: t.colors.primary, ...t.shadow },
    secondary: { backgroundColor: t.colors.primarySoft },
    ghost: { backgroundColor: 'transparent', borderColor: t.colors.border },
    danger: { backgroundColor: t.tones.danger.bg },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
    text: { fontSize: t.fs(16), fontWeight: '700' },
    textPrimary: { color: t.colors.onPrimary },
    textSecondary: { color: t.tones.primary.fg },
    textGhost: { color: t.colors.text },
    textDanger: { color: t.tones.danger.fg },
  });

export const inputStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { marginBottom: t.spacing.lg },
    label: { fontSize: t.fs(14), fontWeight: '700', color: t.colors.text, marginBottom: 6 },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.md,
      borderWidth: t.highContrast ? 1.5 : 1.5,
      borderColor: t.colors.border,
      paddingHorizontal: t.spacing.md,
    },
    focused: { borderColor: t.colors.primary },
    errored: { borderColor: t.colors.danger },
    multiline: { alignItems: 'flex-start', paddingVertical: t.spacing.sm },
    icon: { marginRight: t.spacing.sm },
    input: {
      flex: 1,
      fontSize: t.fs(16),
      color: t.colors.text,
      paddingVertical: 12,
      minHeight: 48,
    },
    inputMulti: { minHeight: 100, paddingTop: 10 },
    error: { color: t.colors.danger, fontSize: t.fs(13), marginTop: 6, fontWeight: '600' },
    hint: { color: t.colors.textMuted, fontSize: t.fs(13), marginTop: 6 },
  });

export const chipStyles = (t: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 40,
      paddingHorizontal: 14,
      borderRadius: t.radius.pill,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidth,
      borderColor: t.colors.border,
      marginRight: t.spacing.sm,
    },
    selected: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
    text: { fontSize: t.fs(14), fontWeight: '600', color: t.colors.text },
    textSelected: { color: t.colors.onPrimary },
  });

export const badgeStyles = (t: Theme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: t.radius.pill,
    },
    text: { fontSize: t.fs(12), fontWeight: '700' },
  });

export const avatarStyles = (t: Theme) =>
  StyleSheet.create({
    base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    text: { color: '#FFFFFF', fontWeight: '800' },
    emoji: { textAlign: 'center', color: '#000000' },
    outlined: { borderWidth: 1.5, borderColor: t.colors.border },
  });

export const avatarPickerStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { marginBottom: t.spacing.lg },
    label: { fontSize: t.fs(14), fontWeight: '700', color: t.colors.text, marginBottom: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    item: {
      padding: 4,
      borderRadius: 32,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    selected: { borderColor: t.colors.primary, backgroundColor: t.colors.primarySoft },
  });

export const cardStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: t.spacing.lg,
      marginBottom: t.spacing.md,
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
      ...t.shadow,
    },
    pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  });

export const progressStyles = (t: Theme) =>
  StyleSheet.create({
    track: {
      height: 8,
      borderRadius: 4,
      backgroundColor: t.colors.surfaceAlt,
      overflow: 'hidden',
    },
    fill: { height: '100%', borderRadius: 4 },
  });

export const sectionStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: t.spacing.lg,
      marginBottom: t.spacing.sm,
    },
    title: { fontSize: t.fs(18), fontWeight: '800', color: t.colors.text },
    action: { fontSize: t.fs(14), fontWeight: '700', color: t.tones.primary.fg },
  });

export const emptyStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { alignItems: 'center', padding: t.spacing.xl, paddingTop: t.spacing.xxl },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: t.colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: t.spacing.lg,
    },
    title: { fontSize: t.fs(18), fontWeight: '800', color: t.colors.text, textAlign: 'center' },
    text: {
      fontSize: t.fs(14),
      color: t.colors.textMuted,
      textAlign: 'center',
      marginTop: 6,
      marginBottom: t.spacing.lg,
    },
  });

export const statTileStyles = (t: Theme) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: t.spacing.md,
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
      ...t.shadow,
    },
    icon: {
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: t.spacing.sm,
    },
    value: { fontSize: t.fs(22), fontWeight: '800', color: t.colors.text },
    label: { fontSize: t.fs(12), color: t.colors.textMuted, marginTop: 2, fontWeight: '600' },
  });

export const segmentedStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      backgroundColor: t.colors.surfaceAlt,
      borderRadius: t.radius.md,
      padding: 4,
      marginBottom: t.spacing.md,
    },
    item: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: t.radius.sm,
      paddingHorizontal: 6,
    },
    destaque: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: t.radius.sm },
    destaqueNormal: { backgroundColor: t.colors.surface, ...t.shadow },
    destaqueHC: { backgroundColor: t.colors.primary },
    text: { fontSize: t.fs(14), fontWeight: '700', color: t.colors.textMuted, textAlign: 'center' },
    textActive: { color: t.highContrast ? t.colors.onPrimary : t.colors.primary },
  });

export const fabStyles = (t: Theme) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: t.spacing.lg,
      bottom: t.spacing.lg,
      minHeight: 56,
      paddingHorizontal: 20,
      borderRadius: t.radius.pill,
      backgroundColor: t.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      shadowColor: '#3E31C9',
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    text: { color: t.colors.onPrimary, fontWeight: '800', fontSize: t.fs(15) },
  });

export const projectCardStyles = (t: Theme) =>
  StyleSheet.create({
    top: { flexDirection: 'row', gap: t.spacing.md },
    icon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1 },
    title: { fontSize: t.fs(17), fontWeight: '800', color: t.colors.text },
    org: { fontSize: t.fs(13), color: t.colors.textMuted, marginTop: 2 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: t.spacing.md },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: t.fs(12), color: t.colors.textMuted, fontWeight: '600' },
    footer: { marginTop: t.spacing.md },
    vagasText: { fontSize: t.fs(12), color: t.colors.textMuted, marginBottom: 6, fontWeight: '600' },
  });

export const postCardStyles = (t: Theme) =>
  StyleSheet.create({
    head: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
    who: { flex: 1 },
    name: { fontSize: t.fs(15), fontWeight: '800', color: t.colors.text },
    sub: { fontSize: t.fs(12), color: t.colors.textMuted, marginTop: 1 },
    body: { fontSize: t.fs(15), color: t.colors.text, lineHeight: t.fs(22), marginTop: t.spacing.md },
    project: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: t.spacing.md,
      padding: t.spacing.md,
      borderRadius: t.radius.md,
      backgroundColor: t.colors.surfaceAlt,
    },
    projectText: { flex: 1, fontSize: t.fs(13), fontWeight: '700', color: t.colors.text },
    actions: {
      flexDirection: 'row',
      gap: t.spacing.lg,
      marginTop: t.spacing.md,
      paddingTop: t.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: t.colors.border,
    },
    action: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
    actionText: { fontSize: t.fs(14), fontWeight: '700', color: t.colors.textMuted },
    comments: { marginTop: t.spacing.xs },
    comment: {
      backgroundColor: t.colors.surfaceAlt,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      marginBottom: t.spacing.sm,
    },
    commentAuthor: { fontSize: t.fs(13), fontWeight: '800', color: t.colors.text },
    commentText: { fontSize: t.fs(14), color: t.colors.text, marginTop: 2 },
    composer: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, marginTop: 4 },
    composerInput: {
      flex: 1,
      minHeight: 46,
      borderRadius: t.radius.pill,
      borderWidth: 1.5,
      borderColor: t.colors.border,
      backgroundColor: t.colors.surface,
      paddingHorizontal: 16,
      fontSize: t.fs(14),
      color: t.colors.text,
    },
    send: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: t.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export const hubCardStyles = (t: Theme) =>
  StyleSheet.create({
    head: { flexDirection: 'row', justifyContent: 'space-between', gap: t.spacing.md },
    titles: { flex: 1 },
    name: { fontSize: t.fs(16), fontWeight: '800', color: t.colors.text },
    place: { fontSize: t.fs(12), color: t.colors.textMuted, marginTop: 2 },
    metrics: { flexDirection: 'row', marginTop: t.spacing.md, gap: t.spacing.sm },
    metric: {
      flex: 1,
      backgroundColor: t.colors.surfaceAlt,
      borderRadius: t.radius.md,
      padding: t.spacing.sm,
      alignItems: 'center',
    },
    metricValue: { fontSize: t.fs(16), fontWeight: '800', color: t.colors.text },
    metricLabel: { fontSize: t.fs(11), color: t.colors.textMuted, fontWeight: '600', marginTop: 2 },
    occ: { marginTop: t.spacing.md },
    occText: { fontSize: t.fs(12), color: t.colors.textMuted, marginBottom: 6, fontWeight: '600' },
  });

export const bannerStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { position: 'absolute', left: t.spacing.md, right: t.spacing.md, zIndex: 50 },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      padding: t.spacing.md,
      borderRadius: t.radius.lg,
      backgroundColor: t.colors.surface,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    texts: { flex: 1 },
    title: { fontSize: t.fs(14), fontWeight: '800', color: t.colors.text },
    sub: { fontSize: t.fs(12), color: t.colors.textMuted, marginTop: 1 },
  });

export const sparkStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
    bar: { flex: 1, borderRadius: 3, minHeight: 3 },
  });

export const listRowStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      minHeight: 56,
      paddingVertical: t.spacing.sm,
    },
    icon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    texts: { flex: 1 },
    label: { fontSize: t.fs(15), fontWeight: '700', color: t.colors.text },
    value: { fontSize: t.fs(13), color: t.colors.textMuted, marginTop: 1 },
  });
