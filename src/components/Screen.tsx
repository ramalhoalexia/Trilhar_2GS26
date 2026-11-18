import React, { type ReactNode } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import useThemedStyles from '../hooks/useThemedStyles';
import { screenStyles } from '../styles/components.styles';

type Props = {
  children: ReactNode;
  /** envolve o conteúdo em um ScrollView com padding padrão */
  scroll?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function Screen({
  children,
  scroll = false,
  edges = ['top'],
  style,
  contentStyle,
}: Props) {
  const s = useThemedStyles(screenStyles);
  return (
    <SafeAreaView style={[s.safe, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[s.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}
