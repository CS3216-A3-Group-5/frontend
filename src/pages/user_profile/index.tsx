import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logout } from '../../api/authentication';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import AppHeader from '../../components/AppHeader';
import UserCardItem from '../../components/UserCardItem/UserCardItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getSelfUserDetails } from '../../redux/slices/userDetailsSlice';
import { setIsLoggedIn } from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { LOGIN } from '../../routes';
import useErrorToast from '../../util/hooks/useErrorToast';
import useVerifyAuthenticationThenLoadData from '../../util/hooks/useVerifyAuthenticationThenLoadData';
import styles from './styles.module.scss';

export default function UserProfile() {
  const history = useHistory();
  const user = useAppSelector((state) => state.userDetails.user);
  const handleApiRequestError = useApiRequestErrorHandler();
  const createErrorToast = useErrorToast();
  const dispatch = useAppDispatch();

  useVerifyAuthenticationThenLoadData(() => {
    dispatch(getSelfUserDetails()).catch((error) => {
      createErrorToast(handleApiRequestError(error));
    });
  });

  function logoutUser() {
    logout()
      .catch((error) => {
        createErrorToast(handleApiRequestError(error));
      })
      .finally(() => {
        dispatch(setIsLoggedIn(false));
        void persistor.purge();
        history.replace(LOGIN);
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
