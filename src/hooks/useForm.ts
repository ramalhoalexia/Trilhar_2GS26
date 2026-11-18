import { useRef, useState } from 'react';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Hook de formulário: guarda valores, valida com `validate(values) => { campo: 'mensagem' }`
 * e revalida em tempo real os campos que já estão com erro.
 */
export default function useForm<T extends object>(
  initial: T,
  validate: (values: T) => FormErrors<T>
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const latest = useRef<T>(initial);

  const setField =
    <K extends keyof T>(key: K) =>
    (value: T[K]) => {
      latest.current = { ...latest.current, [key]: value };
      setValues(latest.current);
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: validate(latest.current)[key] }));
      }
    };

  const blurField = (key: keyof T) => () => {
    setErrors((prev) => ({ ...prev, [key]: validate(latest.current)[key] }));
  };

  const submit = (onValid: (values: T) => Promise<void> | void) => async () => {
    const found = validate(latest.current);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return false;
    await onValid(latest.current);
    return true;
  };

  const reset = (next: T = initial) => {
    latest.current = next;
    setValues(next);
    setErrors({});
  };

  return { values, errors, setField, blurField, submit, reset };
}
