import { IonPage } from '@ionic/react';
import AppHeader from '../../../components/AppHeader';

enum LoginErrorReason {
  UNREGISTERED_EMAIL = 0,
  INVALID_PASSWORD = 1,
}

export default function LoginPage() {
  return (
    <IonPage>
      <AppHeader />
    </IonPage>
  );
}
