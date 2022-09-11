import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function Homepage() {
  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <IonHeader collapse="fade">
          <IonToolbar>
            <IonSearchbar />
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
}
