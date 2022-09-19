import {
  IonAvatar,
  IonButton,
  IonContent,
  IonPage,
  IonText,
  NavContext,
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { DetailedUser } from '../../../api/types';
import { getSelfUser, updateSelfUser } from '../../../api/users';
import AppHeader from '../../../components/AppHeader';
import InputField from '../../../components/InputField';
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
  const { goBack } = useContext(NavContext);

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

    if (telegram && (telegram.length < 5 || telegram.length > 32)) {
      setErrorText(
        'Telegram handle length must be between 5 and 32 characters'
      );
      return;
    }

    if (phoneNumber && isNaN(Number(phoneNumber))) {
      setErrorText('Phone number must only contain numerals');
      return;
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
        goBack();
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
  }

  const inputFieldStyle = {
    width: '60%',
    minWidth: '20rem',
  };

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
              haveError
              errorMessage="Name cannot be blank"
            />
            <InputField
              value={uniCourse}
              setter={setUniCourse}
              label={'Course'}
            />
            <InputField
              value={bio}
              setter={setBio}
              label={'Bio'}
              multiline={true}
              rows={7}
            />
            <InputField value={email} setter={setEmail} label={'Email'} />
            <InputField
              value={telegram}
              setter={setTelegram}
              label={'Telegram (optional)'}
            />
            <InputField
              value={phoneNumber}
              setter={setPhoneNumber}
              label={'Phone Number (optional)'}
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
