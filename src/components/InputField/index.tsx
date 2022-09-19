import { IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import styles from './styles.module.scss';

interface InputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  multiline?: boolean;
  rows?: number;
  errorMessage?: string;
  placeholder?: string;
  debounce?: number;
}

export default function InputField({
  value,
  onChange,
  label,
  multiline = false,
  rows = 3,
  errorMessage,
  placeholder,
  debounce,
}: InputFieldProps) {
  return (
    <IonItem lines="inset">
      {errorMessage ? (
        <IonLabel color="danger" position="stacked">
          <h2>{errorMessage}</h2>
        </IonLabel>
      ) : (
        <IonLabel position="floating">
          <h2>{label}</h2>
        </IonLabel>
      )}

      {!multiline ? (
        <IonInput
          value={value}
          placeholder={placeholder}
          debounce={debounce ? debounce : 0}
          onIonChange={onChange ? (e) => onChange(e.detail.value!) : undefined}
        />
      ) : (
        <IonTextarea
          placeholder={placeholder}
          debounce={debounce ? debounce : 0}
          className={styles.customTextArea}
          value={value}
          onIonChange={onChange ? (e) => onChange(e.detail.value!) : undefined}
          rows={rows}
          style={{ height: String(rows + 4) + 'rem' }}
        />
      )}
    </IonItem>
  );
}
