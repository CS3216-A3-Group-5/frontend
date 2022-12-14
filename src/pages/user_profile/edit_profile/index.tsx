import { IonAvatar, IonContent, IonPage } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getFullURL } from '../../../api';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { uploadImage } from '../../../api/pictures';
import { ContactDetails, DetailedUser } from '../../../api/types';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardButton,
  InputFormCardField,
} from '../../../components/InputFormCard';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { updateSelfUserDetails } from '../../../redux/slices/userDetailsSlice';
import { USER_PROFILE } from '../../../routes';
import { useCheckUserProfileCreated } from '../../../util/hooks/useCheckUserProfileCreated';
import useErrorToast from '../../../util/hooks/useErrorToast';
import useVerifyAuthenticationThenLoadData from '../../../util/hooks/useVerifyAuthenticationThenLoadData';
import styles from './styles.module.scss';

/**
 * Page for editing profile
 */
export default function EditProfile({ title }: { title: string }) {
  enum EditProfileFormField {
    NAME = 'Name',
    COURSE = 'Course',
    BIO = 'Bio',
    MATRICULATION_YEAR = 'Matriculation Year',
    TELEGRAM_HANDLE = 'Telegram (optional)',
    PHONE_NUMBER = 'Phone Number (optional)',
  }

  type FieldErrors = {
    [key in EditProfileFormField]: string;
  };

  const presentErrorToast = useErrorToast();
  const handleApiRequestError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    [EditProfileFormField.NAME]: '',
    [EditProfileFormField.COURSE]: '',
    [EditProfileFormField.BIO]: '',
    [EditProfileFormField.MATRICULATION_YEAR]: '',
    [EditProfileFormField.TELEGRAM_HANDLE]: '',
    [EditProfileFormField.PHONE_NUMBER]: '',
  });

  const userStore = useAppSelector((state) => state.userDetails.user);
  const [user, setUserDetails] = useState<DetailedUser>({
    contactDetails: {
      email: '',
      telegramHandle: '',
      phoneNumber: '',
    },
    matriculationYear: '',
    universityCourse: '',
    bio: '',
    id: '',
    name: '',
    connectionStatus: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [tempUrl, setTempUrl] = useState<string>('');

  useCheckUserProfileCreated();

  useVerifyAuthenticationThenLoadData(undefined, () => {
    setUserDetails(userStore);
  });

  useLayoutEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setTempUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  function updateUser() {
    let haveError = false;
    let currFieldErrors = {
      [EditProfileFormField.NAME]: '',
      [EditProfileFormField.COURSE]: '',
      [EditProfileFormField.BIO]: '',
      [EditProfileFormField.MATRICULATION_YEAR]: '',
      [EditProfileFormField.TELEGRAM_HANDLE]: '',
      [EditProfileFormField.PHONE_NUMBER]: '',
    };

    const newUser = user;
    const telegram = user.contactDetails.telegramHandle;
    // If user puts @ at start of handle, automatically remove it
    if (telegram && telegram[0] === '@') {
      const contactDetails: ContactDetails = {
        ...user.contactDetails,
        telegramHandle: telegram.substring(1),
      };
      newUser.contactDetails = contactDetails;
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
    if (!user.matriculationYear) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.MATRICULATION_YEAR]:
          'Please enter your matriculation year.',
      };
      haveError = true;
    } else if (isNaN(Number(user.matriculationYear))) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.MATRICULATION_YEAR]:
          'Matriculation year must only contain numbers',
      };
      haveError = true;
    } else if (
      Number(user.matriculationYear) > new Date().getFullYear() ||
      Number(user.matriculationYear) < new Date().getFullYear() - 5
    ) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.MATRICULATION_YEAR]: 'Invalid matriculation year',
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
      user.contactDetails.phoneNumber &&
      isNaN(Number(user.contactDetails.phoneNumber))
    ) {
      currFieldErrors = {
        ...currFieldErrors,
        [EditProfileFormField.PHONE_NUMBER]:
          'Phone number must only contain numerals',
      };
      haveError = true;
    }

    setUserDetails(newUser);
    setFieldErrors(currFieldErrors);

    if (!haveError) {
      setIsLoading(true);
      dispatch(updateSelfUserDetails(newUser))
        .unwrap()
        .then(
          () => {
            if (selectedFile) {
              uploadImage(selectedFile).catch((error) => {
                presentErrorToast(handleApiRequestError(error));
              });
            }
            history.replace(USER_PROFILE);
          },
          (error) => {
            presentErrorToast(handleApiRequestError(error));
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
      onChange: (value) =>
        setUserDetails({
          ...user,
          name: value,
        }),
      errorMessage: fieldErrors[EditProfileFormField.NAME],
    },
    {
      title: EditProfileFormField.COURSE,
      value: user.universityCourse,
      onChange: (value) =>
        setUserDetails({
          ...user,
          universityCourse: value,
        }),
      errorMessage: fieldErrors[EditProfileFormField.COURSE],
    },
    {
      title: EditProfileFormField.BIO,
      value: user.bio,
      onChange: (value) =>
        setUserDetails({
          ...user,
          bio: value,
        }),
      errorMessage: fieldErrors[EditProfileFormField.BIO],
      multiline: true,
    },
    {
      title: EditProfileFormField.MATRICULATION_YEAR,
      value: user.matriculationYear,
      onChange: (value) =>
        setUserDetails({
          ...user,
          matriculationYear: value,
        }),
      errorMessage: fieldErrors[EditProfileFormField.MATRICULATION_YEAR],
    },
    {
      title: EditProfileFormField.TELEGRAM_HANDLE,
      value: user.contactDetails.telegramHandle,
      onChange: (value) =>
        setUserDetails({
          ...user,
          contactDetails: {
            ...user.contactDetails,
            telegramHandle: value,
          },
        }),
      errorMessage: fieldErrors[EditProfileFormField.TELEGRAM_HANDLE],
    },
    {
      title: EditProfileFormField.PHONE_NUMBER,
      value: user.contactDetails.phoneNumber,
      onChange: (value) =>
        setUserDetails({
          ...user,
          contactDetails: {
            ...user.contactDetails,
            phoneNumber: value,
          },
        }),
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
      <IonPage
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            updateUser();
          }
        }}
      >
        <AppHeader />
        <IonContent
          fullscreen
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateUser();
            }
          }}
        >
          <div className={styles['container']}>
            <label htmlFor="upload">
              <IonAvatar slot="start" className={styles['profile-picture']}>
                <img
                  alt="user picture"
                  src={
                    tempUrl
                      ? tempUrl
                      : user.profilePic
                      ? getFullURL(user.profilePic)
                      : 'assets/user_default_icon.svg'
                  }
                ></img>
              </IonAvatar>
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : undefined)
              }
              style={{ display: 'none' }}
            />
          </div>
          <InputFormCard
            title={title}
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
