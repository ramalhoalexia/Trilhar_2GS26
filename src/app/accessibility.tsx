import React from 'react';
import { View, Text, Switch } from 'react-native';
import Screen from '@/components/Screen';
import Chip from '@/components/Chip';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useSettings } from '@/context/SettingsContext';
import { profileStyles } from '@/styles/profile.styles';

const SIZES = [
  { key: 1, label: 'Normal' },
  { key: 1.15, label: 'Grande' },
  { key: 1.3, label: 'Muito grande' },
];

export default function AccessibilityScreen() {
  const s = useThemedStyles(profileStyles);
  const { theme, darkMode, highContrast, fontScale, update } = useSettings();

  return (
    <Screen scroll edges={['bottom']}>
      <Text style={s.pageText}>
        Ajuste o app para ficar mais confortável de ler. As mudanças valem na hora e ficam salvas
        neste aparelho.
      </Text>

      <View style={s.card}>
        <View style={s.switchRow}>
          <View style={s.switchTexts}>
            <Text style={s.switchTitle}>Modo noturno</Text>
            <Text style={s.switchSub}>
              Fundo escuro, mais confortável para usar à noite.
              {highContrast ? ' O alto contraste está ligado e tem prioridade.' : ''}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(value) => update({ darkMode: value })}
            accessibilityLabel="Modo noturno"
            trackColor={{ true: theme.colors.primary, false: '#B9BBD0' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={s.card}>
        <View style={s.switchRow}>
          <View style={s.switchTexts}>
            <Text style={s.switchTitle}>Alto contraste</Text>
            <Text style={s.switchSub}>Fundo preto e cores fortes para facilitar a leitura.</Text>
          </View>
          <Switch
            value={highContrast}
            onValueChange={(value) => update({ highContrast: value })}
            accessibilityLabel="Alto contraste"
            trackColor={{ true: theme.colors.primary, false: '#B9BBD0' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={s.card}>
        <View style={{ paddingVertical: 12 }}>
          <Text style={s.switchTitle}>Tamanho do texto</Text>
          <Text style={s.switchSub}>Aumenta as letras em todas as telas.</Text>
          <View style={[s.sizeRow, { flexWrap: 'wrap', rowGap: 8 }]}>
            {SIZES.map((o) => (
              <Chip
                key={o.key}
                label={o.label}
                selected={fontScale === o.key}
                onPress={() => update({ fontScale: o.key })}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={s.sample}>
        <Text style={s.sampleTitle}>Exemplo de texto</Text>
        <Text style={s.sampleText}>
          Programação do Zero começa em 01/12/2026 e tem 9 vagas restantes. Toque para se inscrever.
        </Text>
      </View>
    </Screen>
  );
}
