import {
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { getModule } from '../../../api/modules';
import { UniModule } from '../../../api/types';
import AppHeader from '../../../components/AppHeader/AppHeader';
import UserListItem from '../../../components/UserListItem';

/**
 * Page to view full details of a university module.
 */
export default function ModuleView({
  match,
}: RouteComponentProps<{ moduleCode: string }>) {
  const [uniModule, setUniModule] = useState<UniModule>();
  //TODO: add filtering and sorting

  // shoot api query before painting to screen
  useLayoutEffect(() => {
    //TODO: add actual api call, with error handling
    //should get the module that we want to get data for from url param
    setUniModule(getModule(match.params.moduleCode));
  }, [match.params.moduleCode]);

  if (uniModule) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent fullscreen>
          <IonToolbar>
            <IonTitle>
              <h1>{uniModule.code}</h1>
              <h4>{uniModule.name}</h4>
            </IonTitle>
            <IonTitle></IonTitle>
          </IonToolbar>
          <IonListHeader>
            <IonLabel>
              <h1>Students</h1>
            </IonLabel>
          </IonListHeader>
          <IonSearchbar />
          <IonList className="ion-no-padding">
            {uniModule.enrolledStudents
              ? uniModule.enrolledStudents.map((user) => (
                  <UserListItem user={user} key={user.id} />
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
