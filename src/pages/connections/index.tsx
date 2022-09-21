import {
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useState, useLayoutEffect } from 'react';
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
  useLayoutEffect(() => {
    setIsLoading(true);
    Promise.all([
      dispatch(getIncoming()),
      dispatch(getOutgoing()),
      dispatch(getConnections()),
    ])
      .catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        {incomingRequests.length > 0 && (
          <IonListHeader>
            <IonLabel>
              <h1>Incoming Requests</h1>
            </IonLabel>
          </IonListHeader>
        )}
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
        {outgoingRequests.length > 0 && (
          <IonListHeader>
            <IonLabel>
              <h1>Outgoing Requests</h1>
            </IonLabel>
          </IonListHeader>
        )}
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
        {connections.length > 0 && (
          <IonListHeader>
            <IonLabel>
              <h1>Connections</h1>
            </IonLabel>
          </IonListHeader>
        )}
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
        <IonLoading isOpen={isLoading ? true : false} />
      </IonContent>
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonPage>
  );
}
