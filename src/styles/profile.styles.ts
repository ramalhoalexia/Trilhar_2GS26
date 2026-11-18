import { StyleSheet } from 'react-native';
import type { Theme } from './theme';

export const profileStyles = (t: Theme) =>
  StyleSheet.create({
    hero: {
      borderRadius: t.radius.xl,
      padding: t.spacing.xl,
      alignItems: 'center',
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
    },
    avatarRing: {
      padding: 4,
      borderRadius: 44,
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    name: { fontSize: t.fs(22), fontWeight: '900', color: '#FFFFFF', marginTop: t.spacing.md },
    email: { fontSize: t.fs(13), color: '#FFFFFF', opacity: 0.9, marginTop: 2 },
    badgeRow: { flexDirection: 'row', gap: 8, marginTop: t.spacing.md },
    tiles: { flexDirection: 'row', gap: t.spacing.md, marginTop: t.spacing.lg },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.lg,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      marginBottom: t.spacing.md,
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
      ...t.shadow,
    },
    divider: { height: 1, backgroundColor: t.colors.border, opacity: 0.6 },
    interests: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: t.spacing.md },
    reservation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: t.spacing.md,
    },
    reservationText: { flex: 1 },
    reservationName: { fontSize: t.fs(14), fontWeight: '800', color: t.colors.text },
    reservationSub: { fontSize: t.fs(12), color: t.colors.textMuted, marginTop: 1 },
    footer: { textAlign: 'center', color: t.colors.textMuted, fontSize: t.fs(12), marginTop: t.spacing.lg },

    // acessibilidade
    pageText: { fontSize: t.fs(15), color: t.colors.textMuted, lineHeight: t.fs(22), marginBottom: t.spacing.lg },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 },
    switchTexts: { flex: 1 },
    switchTitle: { fontSize: t.fs(16), fontWeight: '800', color: t.colors.text },
    switchSub: { fontSize: t.fs(13), color: t.colors.textMuted, marginTop: 2 },
    sizeRow: { flexDirection: 'row', gap: t.spacing.sm, marginTop: t.spacing.md },
    sample: {
      marginTop: t.spacing.lg,
      padding: t.spacing.lg,
      borderRadius: t.radius.lg,
      backgroundColor: t.colors.surfaceAlt,
    },
    sampleTitle: { fontSize: t.fs(16), fontWeight: '800', color: t.colors.text },
    sampleText: { fontSize: t.fs(14), color: t.colors.textMuted, marginTop: 4, lineHeight: t.fs(20) },
  });
