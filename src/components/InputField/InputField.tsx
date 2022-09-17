import { IonInput, IonLabel, IonTextarea } from '@ionic/react';
import styles from './styles.module.scss';

interface InputFieldProps {
  value?: string;
  setter: (e: string) => void;
  label?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  rows?: number;
}

export default function InputField({
  value,
  setter,
  label,
  style,
  multiline = false,
  rows = 3,
}: InputFieldProps) {
  return (
    <div className={styles.field} style={style}>
      <IonLabel className={styles.fieldLabel}>{label}</IonLabel>
      {!multiline && (
        <IonInput
          className={styles.customInput}
          value={value}
          onIonChange={(e) => setter(e.detail.value!)}
        />
      )}
      {multiline && (
        <IonTextarea
          className={styles.customTextArea}
          value={value}
          onIonChange={(e) => setter(e.detail.value!)}
          rows={rows}
          style={{ height: String(rows + 4) + 'rem' }}
        />
      )}
    </div>
  );
}
