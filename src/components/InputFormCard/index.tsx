import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonLoading,
  IonCardSubtitle,
  IonRow,
  IonGrid,
  IonCol,
} from '@ionic/react';
import InputField from '../InputField';

export interface InputFormCardField {
  title: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage: string;
  multiline?: boolean;
  maxlength?: number;
  type?: 'password' | 'text';
}

export interface InputFormCardButton {
  title: string;
  color: string;
  onClick: () => void;
}

interface InputFormCardProps {
  title: string;
  inputFields: Array<InputFormCardField>;
  buttons: Array<InputFormCardButton>;
  isLoading?: boolean;
  errorMessage?: string;
  image?: string;
}
export default function InputFormCard({
  title,
  inputFields,
  buttons,
  isLoading,
  errorMessage,
  image,
}: InputFormCardProps) {
  return (
    <IonCard>
      <IonCardHeader>
        <img src={image}></img>
        <IonCardTitle>
          <h1>{title}</h1>
        </IonCardTitle>
        {errorMessage && (
          <IonCardSubtitle color="danger" mode="md">
            <h3>{errorMessage}</h3>
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      {inputFields.map((fieldDetails: InputFormCardField) => (
        <InputField
          key={fieldDetails.title}
          value={fieldDetails.value}
          label={fieldDetails.title}
          placeholder={fieldDetails.title}
          debounce={200}
          onChange={fieldDetails.onChange}
          errorMessage={fieldDetails.errorMessage}
          multiline={fieldDetails.multiline}
          maxlength={fieldDetails.maxlength}
          type={fieldDetails.type}
        ></InputField>
      ))}
      {buttons.length > 1 ? (
        <IonGrid>
          <IonRow>
            {buttons.map((buttonDetails) => (
              <IonCol key={buttonDetails.title}>
                <IonButton
                  color={buttonDetails.color}
                  onClick={buttonDetails.onClick}
                  expand="block"
                >
                  {buttonDetails.title}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      ) : (
        <IonButton
          color={buttons[0].color}
          expand="block"
          className="ion-padding-horizontal ion-margin-vertical"
          onClick={buttons[0].onClick}
        >
          {buttons[0].title}
        </IonButton>
      )}
      <IonLoading isOpen={isLoading ? true : false} />
    </IonCard>
  );
}
