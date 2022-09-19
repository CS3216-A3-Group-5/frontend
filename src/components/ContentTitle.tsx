import { IonItem } from '@ionic/react';

interface ContentTitleProps {
  children: string;
}

export default function ContentTitle({ children }: ContentTitleProps) {
  return (
    <IonItem lines="none">
      <h1>{children}</h1>
    </IonItem>
  );
}
