import React from 'react';
import { Pressable, Text, View } from 'react-native';
import useThemedStyles from '../hooks/useThemedStyles';
import { sectionStyles } from '../styles/components.styles';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export default function SectionTitle({ title, action, onAction }: Props) {
  const s = useThemedStyles(sectionStyles);
  return (
    <View style={s.row}>
      <Text style={s.title} accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10}>
          <Text style={s.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
