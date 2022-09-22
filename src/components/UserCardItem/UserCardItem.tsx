import { IonCard, IonCardContent, IonAvatar, IonIcon } from '@ionic/react';
import { callOutline, mail, paperPlaneOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getFullURL } from '../../api';
import { DetailedUser, UserStatus } from '../../api/types';
import styles from './styles.module.scss';

interface UserCardItemProps {
  user: DetailedUser;
  module?: string; //when viewing this user from within a module
}

function UserDetails({ user, module }: UserCardItemProps) {
  return (
    <div>
      <h1 className={styles['name']}>{user.name}</h1>
      <h2 className={styles['major']}>
        Y{new Date().getFullYear() - Number(user.matriculationYear) + 1}{' '}
        {user.universityCourse}
      </h2>
      {module &&
        (user.userStatus && user.userStatus !== UserStatus.NO_STATUS ? (
          <p
            className={
              user.userStatus === UserStatus.LOOKING_FOR_A_FRIEND
                ? styles['user-status-looking-for-friend']
                : styles['user-status-willing-to-help']
            }
          >
            {user.userStatus}
          </p>
        ) : null)}
    </div>
  );
}

/**
 * Takes in a User object and creates a user card item for viewing full user details
 */
export default function UserCardItem({ user, module }: UserCardItemProps) {
  const [isDesktop, setDesktop] = useState<boolean>(window.innerWidth >= 500);
  const updateMedia = () => {
    setDesktop(window.innerWidth >= 500);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return (
    <IonCard>
      <IonCardContent>
        <div className={styles['top-row']}>
          <IonAvatar slot="start" className={styles['profile-picture']}>
            <img
              alt="user picture"
              src={
                user.profilePic
                  ? getFullURL(user.profilePic)
                  : 'assets/user_default_icon.svg'
              }
            ></img>
          </IonAvatar>

          <div className={styles['user-information']}>
            {isDesktop && <UserDetails user={user} module={module} />}
            <div className={styles['contact-information']}>
              <div>
                <IonIcon icon={mail} color="tertiary" />
                <h2>{user.contactDetails.email}</h2>
              </div>
              <div>
                <IonIcon icon={paperPlaneOutline} color="primary" />
                <h2>
                  {user.contactDetails.telegramHandle
                    ? '@' + user.contactDetails.telegramHandle
                    : 'None'}
                </h2>
              </div>
              <div>
                <IonIcon icon={callOutline} color="danger" />
                <h2>
                  {user.contactDetails.phoneNumber
                    ? user.contactDetails.phoneNumber
                    : 'None'}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          {!isDesktop && <UserDetails user={user} />}
        </div>

        {user.bio !== '' && (
          <div className={styles['bio-row']}>
            <h1 className={styles['bio-header']}>Bio</h1>
            <h2 className={styles['bio']}>{user.bio}</h2>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}
