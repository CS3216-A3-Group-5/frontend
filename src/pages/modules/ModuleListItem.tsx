import { IonItem, IonLabel } from '@ionic/react';
import { UniModule } from '../../api/types';

interface ModuleListItemProps {
  uniModule: UniModule;
  // path to append module code to
  path: string;
}

/**
 * Page to view full details of a university module.
 */
export default function ModuleListItem({
  uniModule,
  path,
}: ModuleListItemProps) {
  return (
    <IonItem routerLink={path + '/' + uniModule.code}>
      <IonLabel slot="start">
        <h1>{uniModule.code}</h1>
        <p>{uniModule.name}</p>
      </IonLabel>
    </IonItem>
  );
}
