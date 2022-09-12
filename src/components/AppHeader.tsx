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
}

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <IonHeader>
      <IonToolbar className={styles['app-header-toolbar']}>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle className={styles['app-title']}>Mod With Me</IonTitle>
      </IonToolbar>
      {children}
    </IonHeader>
  );
}
