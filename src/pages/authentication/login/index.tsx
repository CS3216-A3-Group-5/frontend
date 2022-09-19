import { IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { login, UserLoginDetails } from '../../../api/authentication';
import {
  ErrorType,
  useApiRequestErrorHandler,
} from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import { isValidEmail } from '../../../util/authentication/constants';
import useErrorToast, {
  ErrorToastErrorType,
} from '../../../util/hooks/useErrorToast';
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
      setIsLoading(false);
      login(userLoginDetails)
        .then((resp) => {
          if (resp[ERROR_FIELD_NAME]) {
            // theres an error with logging in 
            setLoginErrorMessage(resp[ERROR_FIELD_NAME]);
          }
          // login success
          history.push('/home');
        })
        .catch((error) => {
          const apiError = handleApiError(error);
          if (apiError.errorType === ErrorType.TIMEOUT) {
            createErrorToast(
              
            )
          } else if (apiError.errorType === ErrorType.NO_CONNECTION) {
            createErrorToast(
              'You are not connected to the internet',
              ErrorToastErrorType.CONNECTION_FAIL
            );
          } else if (apiError.errorType === ErrorType.AUTHENTICATION_FAIL) {
          } else {
            createErrorToast(
              'An unknown error occured.',
              ErrorToastErrorType.OTHER
            );
          }
        })
        .finally(() => {
          setIsLoading(true);
        });
    }
  }

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <InputFormCard
          title="Register"
          inputFields={loginInputFields}
          buttons={formButtons}
          isLoading={isLoading}
          errorMessage={loginErrorMessage}
        />
      </IonContent>
    </IonPage>
  );
}
