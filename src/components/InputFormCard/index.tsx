import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonLoading,
} from '@ionic/react';
import InputField from '../InputField';

export interface InputFormCardField {
  title: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage: string;
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
}
export default function InputFormCard({
  title,
  inputFields,
  buttons,
  isLoading,
}: InputFormCardProps) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <h1>{title}</h1>
        </IonCardTitle>
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
      {isLoading && <IonLoading isOpen={isLoading} />}
    </IonCard>
  );
}
