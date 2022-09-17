import { IonContent, IonPage } from '@ionic/react';
import AppHeader from '../../../components/AppHeader/AppHeader';

/**
 * Page for editing profile
 */
export default function EditProfile() {
  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <h1>Test</h1>
      </IonContent>
    </IonPage>
  );
}
