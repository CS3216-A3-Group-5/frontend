import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { UserLoginDetails } from '../../../api/authentication';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardButton,
  InputFormCardField,
} from '../../../components/InputFormCard';
import { useAppDispatch } from '../../../redux/hooks';
import { submitRegisterForm } from '../../../redux/slices/userSlice';
import { VERIFY_EMAIL } from '../../../routes';
import { isValidEmail } from '../../../util/authentication/constants';

enum RegisterUserErrorReason {
  EMAIL_ALREADY_USED = 0,
}

enum RegisterFormField {
  EMAIL = 'Email',
  PASSWORD = 'Password',
  CONFIRMATION_PASSWORD = 'Confirmation Password',
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
      dispatch(submitRegisterForm(registerDetails))
        .then(() => {
          history.push(VERIFY_EMAIL);
        })
        .catch((error) => {
          const errorDetails = handleApiRequestError(error);
          if (
            errorDetails.errorReason ===
            RegisterUserErrorReason.EMAIL_ALREADY_USED
          ) {
            //TODO: show toast error
          }
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
    },
    {
      title: RegisterFormField.CONFIRMATION_PASSWORD,
      value: confirmPassword,
      onChange: (value) => setConfirmPassword(value),
      errorMessage: fieldErrors[RegisterFormField.CONFIRMATION_PASSWORD],
    },
  ];

  const formButtons: Array<InputFormCardButton> = [
    {
      title: 'Register',
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
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
