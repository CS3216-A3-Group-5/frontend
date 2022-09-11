import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import styles from './styles.module.scss';

export default function AppHeader() {
  return (
    <IonHeader>
      <IonToolbar className={styles['app-header-toolbar']}>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle className={styles['app-title']}>Mod With Me</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}
