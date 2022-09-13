import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonContent,
  // IonItem,
  // IonLabel,
  IonPage,
} from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import { useEffect, useState } from 'react';
import { DetailedUser } from '../../api/types';
import { getSelfUser } from '../../api/users';
import styles from './styles.module.scss';

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
          <IonCard color="primary">
            <IonCardContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <IonAvatar slot="start" className={styles['profile-picture']}>
                    <img
                      alt="user picture"
                      src={
                        user.profilePic
                          ? user.profilePic
                          : 'assets/user_default_icon.svg'
                      }
                    ></img>
                  </IonAvatar>
                  <div className={styles['user-information']}>
                    <h1 className={styles['name']}>{user.name}</h1>
                    <h2 className={styles['major']}>
                      Majoring in {user.universityCourse}
                    </h2>

                    <h1 className={styles['bio-header']}>Bio</h1>
                    <h2 className={styles['bio']}>{user.bio}</h2>
                  </div>
                </div>

                <div className={styles['contact-information']}>
                  <h2>Email: {user.contact_details.email}</h2>
                  <h2>
                    Telegram:{' '}
                    {user.contact_details.telegramHandle
                      ? user.contact_details.telegramHandle
                      : 'None'}
                  </h2>
                  <h2>
                    Phone Number:{' '}
                    {user.contact_details.phoneNumber
                      ? user.contact_details.phoneNumber
                      : 'None'}
                  </h2>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
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

// <IonItem>
//   <IonAvatar slot="start" className={styles['profilePicture']}>
//     <img
//       alt="user thumbnail"
//       src={
//         user.profilePic
//           ? user.profilePic
//           : 'assets/user_default_icon.svg'
//       }
//     ></img>
//   </IonAvatar>
//   <IonLabel>
//     <h1>{user.name}</h1>
//     <h2>Majoring in {user.universityCourse}</h2>
//     {user.userStatus ? <p>{user.userStatus}</p> : null}
//   </IonLabel>
// </IonItem>
