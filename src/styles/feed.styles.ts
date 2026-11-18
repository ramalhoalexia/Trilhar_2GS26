import { StyleSheet } from 'react-native';
import type { Theme } from './theme';

export const feedStyles = (t: Theme) =>
  StyleSheet.create({
    list: { paddingHorizontal: t.spacing.lg, paddingBottom: 120 },
    hero: {
      borderRadius: t.radius.xl,
      padding: t.spacing.xl,
      marginTop: t.spacing.sm,
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
    },
    heroHi: { fontSize: t.fs(14), color: t.colors.onHero, opacity: 0.9, fontWeight: '600' },
    heroTitle: {
      fontSize: t.fs(22),
      color: t.colors.onHero,
      fontWeight: '800',
      marginTop: 4,
      lineHeight: t.fs(28),
    },
    heroProgress: { marginTop: t.spacing.lg },
    heroProgressText: {
      color: t.colors.onHero,
      fontSize: t.fs(13),
      fontWeight: '700',
      marginBottom: 8,
    },
    heroBtn: {
      marginTop: t.spacing.lg,
      minHeight: 48,
      borderRadius: t.radius.md,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 18,
      alignSelf: 'flex-start',
    },
    heroBtnText: { color: '#3E31C9', fontWeight: '800', fontSize: t.fs(15) },
    tiles: { flexDirection: 'row', gap: t.spacing.md, marginTop: t.spacing.lg },
    chips: { flexDirection: 'row', marginTop: t.spacing.lg, marginBottom: t.spacing.md },
    warnCard: {
      flexDirection: 'row',
      gap: t.spacing.md,
      alignItems: 'center',
      backgroundColor: t.tones.warn.bg,
      borderRadius: t.radius.lg,
      padding: t.spacing.md,
      marginTop: t.spacing.lg,
      borderWidth: t.highContrast ? 1.5 : 0,
      borderColor: t.colors.border,
    },
    warnText: { flex: 1, color: t.tones.warn.fg, fontWeight: '700', fontSize: t.fs(13) },
  });
