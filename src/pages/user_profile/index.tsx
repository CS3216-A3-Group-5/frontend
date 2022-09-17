import { IonContent, IonPage, IonButton } from '@ionic/react';
import AppHeader from '../../components/AppHeader/AppHeader';
import { useEffect, useState } from 'react';
import { DetailedUser } from '../../api/types';
import { getSelfUser } from '../../api/users';
import styles from './styles.module.scss';
import UserCardItem from '../../components/UserCardItem/UserCardItem';
import { handleApiRequestError } from '../../api/errors';

export default function UserProfile() {
  const [user, setUserDetails] = useState<DetailedUser>();

  // shoot api query before painting to screen
  useEffect(() => {
    getSelfUser().then(
      (user) => {
        console.log(user);
        setUserDetails(user);
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
  }, []);

  if (user) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent fullscreen>
          <UserCardItem user={user} />
          <IonButton
            className={styles['edit-profile-button']}
            routerLink={'/user_profile/edit'}
          >
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
