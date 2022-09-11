import {
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { getModule } from '../../../api/modules';
import { UniModule } from '../../../api/types';
import AppHeader from '../../../components/AppHeader';
import UserListItem from '../../../components/UserListItem';

/**
 * Page to view full details of a university module.
 */
export default function ModuleView({
  match,
}: RouteComponentProps<{ moduleCode: string }>) {
  const [uniModule, setUniModule] = useState<UniModule>();
  //TODO: add filtering and sorting

  function getModuleDetails() {
    setUniModule(getModule(match.params.moduleCode));
  }

  // shoot api query before painting to screen
  useLayoutEffect(() => {
    //TODO: add actual api call, with error handling
    //should get the module that we want to get data for from url param
    getModuleDetails();
  }, []);

  if (uniModule) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent fullscreen>
          <IonToolbar>
            <IonTitle size="large">{uniModule.code}</IonTitle>
            <IonTitle size="small">{uniModule.name}</IonTitle>
          </IonToolbar>
          <IonListHeader>
            <IonLabel>
              <h1>Students</h1>
            </IonLabel>
          </IonListHeader>
          <IonList>
            {uniModule.enrolledStudents
              ? uniModule.enrolledStudents.map((user) => (
                  <UserListItem user={user} />
                ))
              : null}
          </IonList>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonTitle>{match.params.moduleCode}</IonTitle>
        </IonHeader>
        <IonContent>
          <h2>No data available: Server unavailable</h2>
        </IonContent>
      </IonPage>
    );
  }
}
