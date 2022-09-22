import { IonContent, IonPage } from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { useLayoutEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { resendOtp, verifyEmail } from '../../../api/authentication';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import AppHeader from '../../../components/AppHeader';
import InputFormCard, {
  InputFormCardField,
} from '../../../components/InputFormCard';
import { APP_NAME } from '../../../constants';
import { analytics } from '../../../firebase';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setIsInProcessOfVerifyingEmail } from '../../../redux/slices/userSlice';
import { HOME, REGISTER } from '../../../routes';
import useErrorToast from '../../../util/hooks/useErrorToast';
import useInfoToast from '../../../util/hooks/useInfoToast';
import { ERROR_FIELD_NAME } from '../constants';

const OTP_LENGTH = 6;

const VerifyPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.email);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isInProcessOfVerifyingEmail = useAppSelector(
    (state) => state.user.isInProcessOfVerifyingEmail
  );
  const handleApiError = useApiRequestErrorHandler();
  const presentInfoToast = useInfoToast();
  const createErrorToast = useErrorToast();
  const [otp, setOtp] = useState<string>('');
  const [fieldErrorMessage, setFieldErrorMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Check before paint if we didnt come from a register page.
   * TODO: check when api is done whether this is needed, as the NonAuthRoute takes care of it.
   */
  useLayoutEffect(() => {
    if (!isInProcessOfVerifyingEmail) {
      history.replace(REGISTER);
    }
  }, []);

  function submitOtp() {
    let haveError = false;
    let currError = '';

    if (!otp) {
      currError = 'Please enter one-time passcode.';
      haveError = true;
    } else if (otp.length !== OTP_LENGTH) {
      currError = 'OTP should be 6 digits.';
      haveError = true;
    }
    setFieldErrorMessage(currError);
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
          presentInfoToast(
            'One-time passcode verified. Enjoy using ' + APP_NAME + '!'
          );
          dispatch(setIsInProcessOfVerifyingEmail(false));
          logEvent(analytics, 'sign_up');
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

  function submitResendOtpRequest() {
    setIsLoading(true);
    resendOtp(email)
      .then((resp) => {
        if (resp[ERROR_FIELD_NAME]) {
          // theres an error with logging in
          setErrorMessage(resp[ERROR_FIELD_NAME]);
          return;
        }
        presentInfoToast('One-time passcode resent to ' + email);
        history.push(HOME);
      })
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const inputFields: Array<InputFormCardField> = [
    {
      title: 'OTP',
      value: otp,
      onChange: (value) => setOtp(value),
      errorMessage: fieldErrorMessage,
      maxlength: 6,
    },
  ];

  const formButtons = [
    {
      title: 'Resend',
      color: 'tertiary',
      onClick: submitResendOtpRequest,
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
          title="Enter one-time passcode"
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
