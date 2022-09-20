import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { registerUser, UserLoginDetails } from '../../../api/authentication';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardButton,
  InputFormCardField,
} from '../../../components/InputFormCard';
import { useAppDispatch } from '../../../redux/hooks';
import {
  setEmail,
  setIsInProcessOfVerifyingEmail,
} from '../../../redux/slices/userSlice';
import { VERIFY_EMAIL } from '../../../routes';
import { isValidEmail } from '../../../util/authentication';
import useErrorToast from '../../../util/hooks/useErrorToast';
import useInfoToast from '../../../util/hooks/useInfoToast';
import { ERROR_FIELD_NAME } from '../constants';

enum RegisterFormField {
  EMAIL = 'Email',
  PASSWORD = 'Password',
  CONFIRMATION_PASSWORD = 'Confirm Password',
}
/**
 * Holds the error messages for each field.
 */
type FieldErrors = {
  [key in RegisterFormField]: string;
};

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const createErrorToast = useErrorToast();
  const presentInfoToast = useInfoToast();
  const [registerErrorMessage, setRegisterErrorMessage] = useState<string>('');
  const handleApiRequestError = useApiRequestErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    [RegisterFormField.EMAIL]: '',
    [RegisterFormField.PASSWORD]: '',
    [RegisterFormField.CONFIRMATION_PASSWORD]: '',
  });

  const [registerDetails, setRegisterDetails] = useState<UserLoginDetails>({
    nus_email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const register = () => {
    let haveError = false;
    let currFieldErrors = {
      [RegisterFormField.EMAIL]: '',
      [RegisterFormField.PASSWORD]: '',
      [RegisterFormField.CONFIRMATION_PASSWORD]: '',
    };
    if (!registerDetails.nus_email) {
      currFieldErrors = {
        ...currFieldErrors,
        [RegisterFormField.EMAIL]: 'Please enter your email.',
      };
      haveError = true;
    } else if (!isValidEmail(registerDetails.nus_email)) {
      currFieldErrors = {
        ...currFieldErrors,
        [RegisterFormField.EMAIL]: 'Not a valid NUS email.',
      };
    }
    if (!registerDetails.password) {
      currFieldErrors = {
        ...currFieldErrors,
        [RegisterFormField.PASSWORD]: 'Please enter your password.',
      };
      haveError = true;
    }
    if (!confirmPassword) {
      currFieldErrors = {
        ...currFieldErrors,
        [RegisterFormField.CONFIRMATION_PASSWORD]:
          'Please confirm your password.',
      };
      haveError = true;
    } else if (confirmPassword !== registerDetails.password) {
      currFieldErrors = {
        ...currFieldErrors,
        [RegisterFormField.CONFIRMATION_PASSWORD]: 'Passwords do not match.',
      };
      haveError = true;
    }

    setFieldErrors(currFieldErrors);

    if (!haveError) {
      setIsLoading(true);
      registerUser(registerDetails)
        .then((resp) => {
          if (resp[ERROR_FIELD_NAME]) {
            // theres an error with logging in
            setRegisterErrorMessage(resp[ERROR_FIELD_NAME]);
            return;
          }
          dispatch(setEmail(registerDetails.nus_email));
          presentInfoToast(
            'One-time passcode sent to ' + registerDetails.nus_email
          );
          dispatch(setIsInProcessOfVerifyingEmail(true));
          history.push(VERIFY_EMAIL);
        })
        .catch((error) => {
          createErrorToast(handleApiRequestError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const registerInputFields: Array<InputFormCardField> = [
    {
      title: RegisterFormField.EMAIL,
      value: registerDetails.nus_email,
      onChange: (value) =>
        setRegisterDetails({
          ...registerDetails,
          nus_email: value,
        }),
      errorMessage: fieldErrors[RegisterFormField.EMAIL],
    },
    {
      title: RegisterFormField.PASSWORD,
      value: registerDetails.password,
      onChange: (value) =>
        setRegisterDetails({
          ...registerDetails,
          password: value,
        }),
      errorMessage: fieldErrors[RegisterFormField.PASSWORD],
      type: 'password',
    },
    {
      title: RegisterFormField.CONFIRMATION_PASSWORD,
      value: confirmPassword,
      onChange: (value) => setConfirmPassword(value),
      errorMessage: fieldErrors[RegisterFormField.CONFIRMATION_PASSWORD],
      type: 'password',
    },
  ];

  const formButtons: Array<InputFormCardButton> = [
    {
      title: 'Submit',
      color: 'primary',
      onClick: register,
    },
  ];

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <InputFormCard
          title="Register"
          inputFields={registerInputFields}
          buttons={formButtons}
          isLoading={isLoading}
          errorMessage={registerErrorMessage}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
