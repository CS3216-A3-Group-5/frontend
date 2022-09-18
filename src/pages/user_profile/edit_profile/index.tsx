import {
  IonAvatar,
  IonButton,
  IonContent,
  IonPage,
  IonText,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { DetailedUser } from '../../../api/types';
import { getSelfUser, updateSelfUser } from '../../../api/users';
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

  const [errorText, setErrorText] = useState<string>();

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

  function updateUser() {
    setErrorText('');
    if (!user) {
      setErrorText('An unexpected error has ocurred');
      return;
    }
    if (!name) {
      setErrorText('Please fill in your name');
      return;
    }
    if (!email) {
      setErrorText('Please fill in an email address');
      return;
    }
    if (!uniCourse) {
      setErrorText('Please fill in a university course');
      return;
    }
    if (!bio) {
      setErrorText('Please fill in a bio');
      return;
    }

    // If user puts @ at start of handle, automatically remove it
    if (telegram && telegram[0] == '@') {
      setTelegram(telegram.substring(1));
    }

    const newUser: DetailedUser = {
      contact_details: {
        email: email,
        telegramHandle: telegram,
        phoneNumber: phoneNumber,
      },
      matriculationYear: user.matriculationYear,
      universityCourse: uniCourse,
      bio: bio,
      id: user.id,
      name: name,
      connectionStatus: 0,
    };

    updateSelfUser(newUser).then(
      (response) => {
        console.log('success');
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
  }

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
              label={'Telegram (optional)'}
              style={{ width: '60%' }}
            />
            <InputField
              value={phoneNumber}
              setter={setPhoneNumber}
              label={'Phone Number (optional)'}
              style={{ width: '60%' }}
            />
            {errorText && (
              <IonText className={styles['error-text']} color="danger">
                {errorText}
              </IonText>
            )}
            <IonButton onClick={updateUser}>Save</IonButton>
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
