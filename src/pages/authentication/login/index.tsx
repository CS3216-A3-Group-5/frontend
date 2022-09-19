import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { login, UserLoginDetails } from '../../../api/authentication';
import {
  useApiRequestErrorHandler,
} from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, { InputFormCardField } from '../../../components/InputFormCard';
import { HOME } from '../../../routes';
import { isValidEmail } from '../../../util/authentication/constants';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleApiError = useApiRequestErrorHandler();
  const createErrorToast = useErrorToast();
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
  const [userLoginDetails, setUserLoginDetails] = useState<UserLoginDetails>({
    nus_email: '',
    password: '',
  });
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
            setLoginErrorMessage(resp[ERROR_FIELD_NAME]);
            return;
          }
          // login success
          history.push(HOME);
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
    }
  ];

  const formButtons = [
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
