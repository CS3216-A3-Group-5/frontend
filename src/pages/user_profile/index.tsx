import { IonContent, IonPage, IonButton } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import { useEffect, useState } from 'react';
import { DetailedUser } from '../../api/types';
import { getSelfUser } from '../../api/users';
import styles from './styles.module.scss';
import UserCardItem from '../../components/UserCardItem';

export default function UserProfile() {
  const [user, setUserDetails] = useState<DetailedUser>();

  // shoot api query before painting to screen
  useEffect(() => {
    //TODO: add actual api call, with error handling
    //should get the detailed user information for currently logged in user
    setUserDetails(getSelfUser());
  }, []);

  if (user) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent fullscreen>
          <UserCardItem user={user} />
          <IonButton className={styles['edit-profile-button']}>
            Edit Profile
          </IonButton>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <AppHeader />
        <IonContent fullscreen></IonContent>
      </IonPage>
    );
  }
}
