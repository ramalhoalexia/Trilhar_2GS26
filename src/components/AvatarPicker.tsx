import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Avatar from './Avatar';
import { AVATARS } from '../constants';
import useThemedStyles from '../hooks/useThemedStyles';
import { avatarPickerStyles } from '../styles/components.styles';

type Props = {
  label?: string;
  /** id do avatar selecionado */
  value?: string | null;
  onChange: (id: string) => void;
};

/** Grade de avatares desenhados para a pessoa escolher o seu. */
export default function AvatarPicker({ label = 'Escolha seu avatar', value, onChange }: Props) {
  const s = useThemedStyles(avatarPickerStyles);
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.grid} accessibilityRole="radiogroup">
        {AVATARS.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              accessibilityRole="radio"
              accessibilityLabel={`Avatar ${option.label}`}
              accessibilityState={{ selected, checked: selected }}
              style={[s.item, selected && s.selected]}
            >
              <Avatar avatar={option.id} size={48} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
