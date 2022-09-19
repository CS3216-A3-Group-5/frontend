import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserLoginDetails, verifyEmail } from '../../../api/authentication';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardField,
} from '../../../components/InputFormCard';
import { useAppSelector } from '../../../redux/hooks';
import { HOME } from '../../../routes';
import { isValidEmail } from '../../../util/authentication/constants';
import useErrorToast from '../../../util/hooks/useErrorToast';
import { ERROR_FIELD_NAME } from '../constants';
import login from '../login';

const OTP_LENGTH = 6;

const VerifyPage: React.FC = () => {
  const history = useHistory();
  const email = useAppSelector((state) => state.user.email);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleApiError = useApiRequestErrorHandler();
  const createErrorToast = useErrorToast();
  const [otp, setOtp] = useState<string>('');
  const [userLoginDetails, setUserLoginDetails] = useState<UserLoginDetails>({
    nus_email: '',
    password: '',
  });
  const [fieldErrorMessage, setFieldErrorMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  function submitOtp() {
    let haveError = false;
    let currError = '';

    if (!userLoginDetails.nus_email) {
      currError = 'Please enter OTP.';
      haveError = true;
    } else if (otp.length != 6) {
      currError = 'OTP should be 6 digits.';
      haveError = true;
    }
    if (!haveError) {
      setIsLoading(true);
      verifyEmail(email, otp)
        .then((resp) => {
          if (resp[ERROR_FIELD_NAME]) {
            // theres an error with logging in
            setErrorMessage(resp[ERROR_FIELD_NAME]);
            return;
          }
          // otp success
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

  function resendOtp() {
    registerUser({})
        .then((resp) => {
          if (resp[ERROR_FIELD_NAME]) {
            // theres an error with logging in 
            setRegisterErrorMessage(resp[ERROR_FIELD_NAME]);
            return;
          }
  }

  const inputFields: Array<InputFormCardField> = [
    {
      title: 'One-Time Passcode',
      value: otp,
      onChange: (value) => setOtp(value),
      errorMessage: errorMessage,
    },
  ];

  const formButtons = [
    {
      title: 'Resend',
      color: 'primary',
      onClick: 
    },
    {
      title: 'Submit',
      color: 'primary',
      onClick: submitOtp,
    },
  ];

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <InputFormCard
          title="Login"
          inputFields={inputFields}
          buttons={formButtons}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </IonContent>
    </IonPage>
  );
};

export default VerifyPage;
