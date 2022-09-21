import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface AppHeaderProps {
  // Children compoennts to customize the bottom of AppHeader
  children?: ReactNode;
  button?: ReactNode;
}

export default function AppHeader({ children, button }: AppHeaderProps) {
  return (
    <IonHeader>
      <IonToolbar className={styles['app-header-toolbar']}>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonButtons slot="end">{button}</IonButtons>
        <IonTitle className={styles['app-title']}>
          <span className={styles['mod-word']}>Mod </span>
          <span className={styles['with-word']}>With </span>
          <span className={styles['me-word']}>Me</span>
        </IonTitle>
      </IonToolbar>
      {children}
    </IonHeader>
  );
}
