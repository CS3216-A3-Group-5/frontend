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
import { analytics } from '../../../firebase';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setEmailInUserDetails } from '../../../redux/slices/userDetailsSlice';
import {
  setHasCreatedProfile,
  setIsInProcessOfVerifyingEmail,
} from '../../../redux/slices/userSlice';
import { CREATE_PROFILE, REGISTER } from '../../../routes';
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
    } else if (isNaN(Number(otp))) {
      currError = 'OTP should only contain numbers';
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
            "One-time passcode verified. Let's create your profile!"
          );
          dispatch(setEmailInUserDetails(email));
          dispatch(setIsInProcessOfVerifyingEmail(false));
          dispatch(setHasCreatedProfile(false));
          logEvent(analytics, 'sign_up');
          history.replace(CREATE_PROFILE);
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
        setErrorMessage('');
        presentInfoToast('One-time passcode resent to ' + email);
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
          subtitle="OTP is valid for 5 minutes."
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
