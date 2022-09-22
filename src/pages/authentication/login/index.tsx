import { IonContent, IonPage } from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login, UserLoginDetails } from '../../../api/authentication';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardField,
} from '../../../components/InputFormCard';
import { analytics } from '../../../firebase';
import { useAppDispatch } from '../../../redux/hooks';
import { setIsLoggedIn } from '../../../redux/slices/userSlice';
import { HOME, REGISTER } from '../../../routes';
import { isValidEmail } from '../../../util/authentication';
import { useCheckAuthAndRedirect } from '../../../util/hooks/useCheckAuthRedirect';
import useErrorToast from '../../../util/hooks/useErrorToast';
import { ERROR_FIELD_NAME } from '../constants';

enum LoginField {
  EMAIL = 'Email',
  PASSWORD = 'Password',
}

/**
 * Holds the error messages for each field.
 */
type FieldErrors = {
  [key in LoginField]: string;
};

export default function LoginPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleApiError = useApiRequestErrorHandler();
  const createErrorToast = useErrorToast();
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
  const [userLoginDetails, setUserLoginDetails] = useState<UserLoginDetails>({
    nus_email: '',
    password: '',
  });
  useCheckAuthAndRedirect();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    [LoginField.EMAIL]: '',
    [LoginField.PASSWORD]: '',
  });

  function submitLogin() {
    let haveError = false;
    let currFieldErrors = {
      [LoginField.EMAIL]: '',
      [LoginField.PASSWORD]: '',
    };

    if (!userLoginDetails.nus_email) {
      currFieldErrors = {
        ...currFieldErrors,
        [LoginField.EMAIL]: 'Please enter your email.',
      };
      haveError = true;
    } else if (!isValidEmail(userLoginDetails.nus_email)) {
      currFieldErrors = {
        ...currFieldErrors,
        [LoginField.EMAIL]: 'Not a valid NUS email.',
      };
      haveError = true;
    }
    if (!userLoginDetails.password) {
      currFieldErrors = {
        ...currFieldErrors,
        [LoginField.PASSWORD]: 'Please enter your password.',
      };
      haveError = true;
    }

    setFieldErrors(currFieldErrors);
    if (!haveError) {
      setIsLoading(true);
      login(userLoginDetails)
        .then((resp) => {
          if (resp.error_message) {
            // theres an error with logging in
            dispatch(setIsLoggedIn(false));
            setLoginErrorMessage(resp[ERROR_FIELD_NAME]);
            return;
          }
          // login success
          dispatch(setIsLoggedIn(true));
          logEvent(analytics, 'login');
          history.replace(HOME);
        })
        .catch((error) => {
          createErrorToast(handleApiError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const loginInputFields: Array<InputFormCardField> = [
    {
      title: LoginField.EMAIL,
      value: userLoginDetails.nus_email,
      onChange: (value) =>
        setUserLoginDetails({
          ...userLoginDetails,
          nus_email: value,
        }),
      errorMessage: fieldErrors[LoginField.EMAIL],
    },
    {
      title: LoginField.PASSWORD,
      value: userLoginDetails.password,
      onChange: (value) =>
        setUserLoginDetails({
          ...userLoginDetails,
          password: value,
        }),
      errorMessage: fieldErrors[LoginField.PASSWORD],
      type: 'password',
    },
  ];

  const formButtons = [
    {
      title: 'Register',
      color: 'tertiary',
      onClick: () => {
        history.push(REGISTER);
      },
    },
    {
      title: 'Login',
      color: 'primary',
      onClick: submitLogin,
    },
  ];

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <InputFormCard
          title="Login"
          inputFields={loginInputFields}
          buttons={formButtons}
          isLoading={isLoading}
          errorMessage={loginErrorMessage}
        />
      </IonContent>
    </IonPage>
  );
}
