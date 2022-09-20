import {
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useState, useEffect } from 'react';


import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { ConnectionType } from '../../api/types';
import AppHeader from '../../components/AppHeader';
import ConnectionListItem from '../../components/ConnectionListItem/ConnectionListItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getConnections,
  getIncoming,
  getOutgoing,
} from '../../redux/slices/connectionsSlice';
import useErrorToast from '../../util/hooks/useErrorToast';

export default function ConnectionsPage() {
  const incomingRequests = useAppSelector(
    (state) => state.connections.incoming
  );
  const outgoingRequests = useAppSelector(
    (state) => state.connections.outgoing
  );
  const connections = useAppSelector((state) => state.connections.connections);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentErrorToast = useErrorToast();
  const handleApiRequestError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch();
  //TODO: add filtering and sorting

  // shoot api query before painting to screen
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      dispatch(getIncoming()).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      }),
      dispatch(getOutgoing()).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      }),
      dispatch(getConnections()).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      }),
    ]).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <IonPage>
        <AppHeader>
          <IonToolbar>
            <IonSearchbar />
          </IonToolbar>
        </AppHeader>
        <IonContent fullscreen>
          <h1>Loading...</h1>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        <IonListHeader>
          <IonLabel>
            <h1>Incoming Requests</h1>
          </IonLabel>
        </IonListHeader>
        <IonList className="ion-no-padding">
          {incomingRequests
            ? incomingRequests.map((request) => (
                <ConnectionListItem
                  connection={request}
                  connectionType={ConnectionType.INCOMING_REQUEST}
                  key={request.id}
                />
              ))
            : null}
        </IonList>
        <IonListHeader>
          <IonLabel>
            <h1>Outgoing Requests</h1>
          </IonLabel>
        </IonListHeader>
        <IonList className="ion-no-padding">
          {outgoingRequests
            ? outgoingRequests.map((request) => (
                <ConnectionListItem
                  connection={request}
                  connectionType={ConnectionType.OUTGOING_REQUEST}
                  key={request.id}
                />
              ))
            : null}
        </IonList>
        <IonListHeader>
          <IonLabel>
            <h1>Connections</h1>
          </IonLabel>
        </IonListHeader>
        <IonList className="ion-no-padding">
          {connections
            ? connections.map((request) => (
                <ConnectionListItem
                  connection={request}
                  connectionType={ConnectionType.CONNECTED}
                  key={request.id}
                />
              ))
            : null}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
