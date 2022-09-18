import { IonContent, IonPage, IonButton } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import { useEffect, useState } from 'react';
import { DetailedUser } from '../../api/types';
import { getSelfUser } from '../../api/users';
import styles from './styles.module.scss';
import UserCardItem from '../../components/UserCardItem/UserCardItem';
import { useApiRequestErrorHandler } from '../../api/errorHandling';

export default function UserProfile() {
  const [user, setUserDetails] = useState<DetailedUser>();
  const handleApiRequestError = useApiRequestErrorHandler();

  // shoot api query before painting to screen
  useEffect(() => {
    getSelfUser().then(
      (user) => {
        console.log(user);
        setUserDetails(user);
      },
      (error) => {
        // console.log(error)
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
        <IonContent fullscreen>
          <div className={styles['loading-text']}>
            <h1>Loading...</h1>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}
