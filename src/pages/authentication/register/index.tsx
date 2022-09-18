import { IonButton, IonContent, IonInput, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { registerUser } from '../../../api/authentication';
import AppHeader from '../../../components/AppHeader';

enum RegisterUserErrorReason {
  EMAIL_ALREADY_USED = 0,
}

const RegisterPage: React.FC = () => {
  const currentPath = useLocation().pathname;
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [errorText, setErrorText] = useState<string>();

  const [registerResult, setRegisterResult] = useState<boolean>(false);

  const register = () => {
    if (!email || !password || !confirmPassword) {
      setErrorText('Please fill in all the fields');
      return;
    }
    registerUser(email, password).then(
      function (registerResult) {
        setRegisterResult(registerResult);
      },
      function (error: Error) {
        setErrorText(error.message);
      }
    );
  };

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <h1>Register</h1>
        <IonInput
          value={email}
          placeholder="Email"
          onIonChange={(e) => setEmail(e.detail.value!)}
        ></IonInput>
        <IonInput
          value={password}
          placeholder="Password"
          onIonChange={(e) => setPassword(e.detail.value!)}
        ></IonInput>
        <IonInput
          value={confirmPassword}
          placeholder="Confirm Password"
          onIonChange={(e) => setConfirmPassword(e.detail.value!)}
        ></IonInput>
        <IonButton color="primary" onClick={register}>
          Register
        </IonButton>
        <h1>
          {errorText
            ? errorText
            : registerResult
            ? 'register success'
            : 'register not succeeded yet'}
        </h1>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
