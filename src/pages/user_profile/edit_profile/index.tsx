import { IonAvatar, IonButton, IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { DetailedUser } from '../../../api/types';
import { getSelfUser } from '../../../api/users';
import AppHeader from '../../../components/AppHeader';
import InputField from '../../../components/InputField/InputField';
import styles from './styles.module.scss';

/**
 * Page for editing profile
 */
export default function EditProfile() {
  const [user, setUserDetails] = useState<DetailedUser>();
  const [name, setName] = useState<string>();
  const [uniCourse, setUniCourse] = useState<string>();
  const [bio, setBio] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [telegram, setTelegram] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const handleApiRequestError = useApiRequestErrorHandler();
  // shoot api query before painting to screen
  useEffect(() => {
    getSelfUser().then(
      (user) => {
        console.log(user);
        setUserDetails(user);
        setName(user.name);
        setUniCourse(user.universityCourse);
        setBio(user.bio);
        setEmail(user.contact_details.email);
        setTelegram(user.contact_details.telegramHandle);
        setPhoneNumber(user.contact_details.phoneNumber);
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
          <div className={styles['container']}>
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
            <InputField
              value={name}
              setter={setName}
              label={'Name'}
              style={{ width: '60%' }}
            />
            <InputField
              value={uniCourse}
              setter={setUniCourse}
              label={'Course'}
              style={{ width: '60%' }}
            />
            <InputField
              value={bio}
              setter={setBio}
              label={'Bio'}
              style={{ width: '60%' }}
              multiline={true}
              rows={7}
            />
            <InputField
              value={email}
              setter={setEmail}
              label={'Email'}
              style={{ width: '60%' }}
            />
            <InputField
              value={telegram}
              setter={setTelegram}
              label={'Telegram'}
              style={{ width: '60%' }}
            />
            <InputField
              value={phoneNumber}
              setter={setPhoneNumber}
              label={'Phone Number'}
              style={{ width: '60%' }}
            />
            <IonButton>Save</IonButton>
          </div>
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
