import {
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { sampleModuleData } from '../../api/sampleData';
import AppHeader from '../../components/AppHeader';
import ModuleListItem from '../modules/ModuleListItem';

export default function Homepage() {
  const currentPath = useLocation().pathname;
  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        <IonListHeader className="ion-padding-top">
          <IonLabel>
            <h1>My Modules</h1>
          </IonLabel>
        </IonListHeader>
        <IonList lines="full">
          {sampleModuleData.map((uniModule) => (
            <ModuleListItem
              uniModule={uniModule}
              key={uniModule.code}
              path={currentPath + '/modules'}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
