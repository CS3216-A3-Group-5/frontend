import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonContent,
  // IonItem,
  // IonLabel,
  IonPage,
  IonIcon,
} from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import { useEffect, useState } from 'react';
import { DetailedUser } from '../../api/types';
import { getSelfUser } from '../../api/users';
import { callOutline, mail, paperPlaneOutline } from 'ionicons/icons';
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
                  <div>
                    <h1 className={styles['name']}>{user.name}</h1>
                    <h2 className={styles['major']}>
                      Majoring in {user.universityCourse}
                    </h2>
                  </div>

                  <div className={styles['contact-information']}>
                    <div>
                      <IonIcon icon={mail} />
                      <h2>{user.contact_details.email}</h2>
                    </div>
                    <div>
                      <IonIcon icon={paperPlaneOutline} />
                      <h2>
                        {user.contact_details.telegramHandle
                          ? user.contact_details.telegramHandle
                          : 'None'}
                      </h2>
                    </div>
                    <div>
                      <IonIcon icon={callOutline} />
                      <h2>
                        {user.contact_details.phoneNumber
                          ? user.contact_details.phoneNumber
                          : 'None'}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className={styles['bio-header']}>Bio</h1>
              <h2 className={styles['bio']}>{user.bio}</h2>
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
