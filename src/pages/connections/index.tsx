import { IonContent, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import AppHeader from '../../components/AppHeader';

export default function ConnectionsPage() {
  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
}
