import { IonItem, IonLabel } from '@ionic/react';
import { UniModule } from '../../api/types';

interface ModuleListItemProps {
  uniModule: UniModule;
}

/**
 * Page to view full details of a university module.
 */
export default function ModuleListItem({ uniModule }: ModuleListItemProps) {
  return (
    <IonItem routerLink={`/modules/${uniModule.code}`}>
      <IonLabel slot="start">
        <h1>{uniModule.code}</h1>
        <p>{uniModule.name}</p>
      </IonLabel>
    </IonItem>
  );
}
