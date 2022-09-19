import { IonAvatar, IonContent, IonPage, NavContext } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { updateSelfUser } from '../../../api/users';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardButton,
  InputFormCardField
} from '../../../components/InputFormCard';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSelfUserDetails, setBio, setCourse, setName, setPhoneNumber, setTelegram } from '../../../redux/slices/userDetailsSlice';
import styles from './styles.module.scss';

/**
 * Page for editing profile
 */
export default function EditProfile() {
  enum EditProfileFormField {
    NAME = 'Name',
    COURSE = 'Course',
    BIO = 'Bio',
    TELEGRAM_HANDLE = 'Telegram (optional)',
    PHONE_NUMBER = 'Phone Number (optional)',
  }

  type FieldErrors = {
    [key in EditProfileFormField]: string;
  };

  // const [user, setUserDetails] = useState<DetailedUser>({
  //   contact_details: {
  //     email: '',
  //     telegramHandle: '',
  //     phoneNumber: '',
  //   },
  //   matriculationYear: '',
  //   universityCourse: '',
  //   bio: '',
  //   id: '',
  //   name: '',
  //   connectionStatus: 0,
  // });

  const user = useAppSelector((state) => state.userDetails.user);
  const handleApiRequestError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch()
  const { goBack } = useContext(NavContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    [EditProfileFormField.NAME]: '',
    [EditProfileFormField.COURSE]: '',
    [EditProfileFormField.BIO]: '',
    [EditProfileFormField.TELEGRAM_HANDLE]: '',
    [EditProfileFormField.PHONE_NUMBER]: '',
  });

  // shoot api query before painting to screen
  useEffect(() => {
    dispatch(getSelfUserDetails()).catch(
      (error) => {
        handleApiRequestError(error)
      }
    );
  }, []);

  function updateUser() {
    let haveError = false;
    let currFieldErrors = {
      [EditProfileFormField.NAME]: '',
      [EditProfileFormField.COURSE]: '',
      [EditProfileFormField.BIO]: '',
      [EditProfileFormField.TELEGRAM_HANDLE]: '',
      [EditProfileFormField.PHONE_NUMBER]: '',
    };

    let telegram = user.contact_details.telegramHandle;
    // If user puts @ at start of handle, automatically remove it
    if (telegram && telegram[0] == '@') {
      telegram = telegram.substring(1);
      setTelegram(telegram)
    }
    if (!user.name) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.NAME]: 'Please enter your name.',
      };
      haveError = true;
    }
    if (!user.universityCourse) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.COURSE]: 'Please enter your course.',
      };
      haveError = true;
    }
    if (!user.bio) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.BIO]: 'Please enter your bio.',
      };
      haveError = true;
    }
    if (telegram && (telegram.length < 5 || telegram.length > 32)) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.TELEGRAM_HANDLE]:
          'Telegram handle length must be between 5 and 32 characters',
      };
      haveError = true;
    }
    if (
      user.contact_details.phoneNumber &&
      isNaN(Number(user.contact_details.phoneNumber))
    ) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.PHONE_NUMBER]:
          'Phone number must only contain numerals',
      };
      haveError = true;
    }

    setFieldErrors(currFieldErrors);

    if (!haveError) {
      updateSelfUser(user)
        .then(
          (response) => {
            console.log('success');
            goBack();
          },
          (error) => {
            handleApiRequestError(error);
          }
        )
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const registerInputFields: Array<InputFormCardField> = [
    {
      title: EditProfileFormField.NAME,
      value: user.name,
      onChange: (value) => setName(value),
      errorMessage: fieldErrors[EditProfileFormField.NAME],
    },
    {
      title: EditProfileFormField.COURSE,
      value: user.universityCourse,
      onChange: (value) => setCourse(value),
      errorMessage: fieldErrors[EditProfileFormField.COURSE],
    },
    {
      title: EditProfileFormField.BIO,
      value: user.bio,
      onChange: (value) => setBio(value),
      errorMessage: fieldErrors[EditProfileFormField.BIO],
      multiline: true,
    },
    {
      title: EditProfileFormField.TELEGRAM_HANDLE,
      value: user.contact_details.telegramHandle,
      onChange: (value) => setTelegram(value),
      errorMessage: fieldErrors[EditProfileFormField.TELEGRAM_HANDLE],
    },
    {
      title: EditProfileFormField.PHONE_NUMBER,
      value: user.contact_details.phoneNumber,
      onChange: (value) => setPhoneNumber(value),
      errorMessage: fieldErrors[EditProfileFormField.PHONE_NUMBER],
    },
  ];

  const formButtons: Array<InputFormCardButton> = [
    {
      title: 'Save',
      color: 'primary',
      onClick: updateUser,
    },
  ];

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
          </div>
          <InputFormCard
            title="Edit Profile"
            inputFields={registerInputFields}
            buttons={formButtons}
            isLoading={isLoading}
          />
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
