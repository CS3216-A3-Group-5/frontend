import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonLoading,
  IonCardSubtitle,
} from '@ionic/react';
import InputField from '../InputField';

export interface InputFormCardField {
  title: string;
  value?: string;
  onChange: (value: string) => void;
  errorMessage: string;
  multiline?: boolean;
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
  image
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
        ></InputField>
      ))}
      {buttons.length > 1 ? (
        buttons.map((buttonDetails) => (
          <IonButton
            key={buttonDetails.title}
            color={buttonDetails.color}
            className="ion-padding-horizontal ion-margin-top"
            onClick={buttonDetails.onClick}
          >
            {buttonDetails.title}
          </IonButton>
        ))
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
