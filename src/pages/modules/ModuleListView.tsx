import {
  IonContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { sampleModuleData } from '../../api/sampleData';
import AppHeader from '../../components/AppHeader';
import ModuleListItem from './ModuleListItem';

export default function ModulesListView() {
  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        <IonList lines="full">
          {sampleModuleData.map((uniModule) => (
            <ModuleListItem uniModule={uniModule} key={uniModule.code} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
