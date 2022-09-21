import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { logout } from '../../api/authentication';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import AppHeader from '../../components/AppHeader';
import UserCardItem from '../../components/UserCardItem/UserCardItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getSelfUserDetails } from '../../redux/slices/userDetailsSlice';
import { LOGIN } from '../../routes';
import useErrorToast from '../../util/hooks/useErrorToast';
import styles from './styles.module.scss';

export default function UserProfile() {
  const history = useHistory();
  const user = useAppSelector((state) => state.userDetails.user);
  const handleApiRequestError = useApiRequestErrorHandler();
  const createErrorToast = useErrorToast();
  const dispatch = useAppDispatch();

  // shoot api query before painting to screen
  useEffect(() => {
    dispatch(getSelfUserDetails()).catch((error) => {
      createErrorToast(handleApiRequestError(error));
    });
  }, []);

  function logoutUser() {
    logout()
      .then(() => {
        history.push(LOGIN);
      })
      .catch((error) => {
        createErrorToast(handleApiRequestError(error));
      });
  }

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
          <IonButton
            className={styles['edit-profile-button']}
            color="danger"
            onClick={logoutUser}
          >
            Logout
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
