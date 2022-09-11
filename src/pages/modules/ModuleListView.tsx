import {
  IonContent,
  IonHeader,
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
      <AppHeader />
      <IonContent fullscreen>
        <IonHeader collapse="fade">
          <IonToolbar>
            <IonSearchbar />
          </IonToolbar>
        </IonHeader>
        <IonList lines="full">
          {sampleModuleData.map((uniModule) => (
            <ModuleListItem uniModule={uniModule} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
