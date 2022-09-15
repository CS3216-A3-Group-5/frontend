import { IonCard, IonCardContent, IonAvatar, IonIcon } from '@ionic/react';
import { callOutline, mail, paperPlaneOutline } from 'ionicons/icons';
import { DetailedUser } from '../api/types';
import styles from './card.module.scss';

interface UserCardItemProps {
  user: DetailedUser;
}

/**
 * Takes in a User object and creates a user card item for viewing full user details
 */
export default function UserCardItem({ user }: UserCardItemProps) {
  return (
    <IonCard>
      <IonCardContent>
        <div className={styles['top-row']}>
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

        <div className={styles['bio-row']}>
          <h1 className={styles['bio-header']}>Bio</h1>
          <h2 className={styles['bio']}>{user.bio}</h2>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
