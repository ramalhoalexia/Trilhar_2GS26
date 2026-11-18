import { Alert, Platform } from 'react-native';

/** Alert que também funciona no navegador (Alert.alert não faz nada no web). */
export function notify(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export function confirm(
  title: string,
  message: string,
  onYes: () => void,
  yesLabel = 'Confirmar'
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: yesLabel, onPress: onYes },
  ]);
}
