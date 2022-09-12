import {
  IonContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { sampleModuleData } from '../../api/sampleData';
import AppHeader from '../../components/AppHeader';
import ModuleListItem from './ModuleListItem';

export default function ModulesPage() {
  const currentPath = useLocation().pathname;
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
            <ModuleListItem
              uniModule={uniModule}
              key={uniModule.code}
              path={currentPath}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
