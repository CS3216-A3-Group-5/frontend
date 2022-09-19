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
import {
  getConnections,
  getIncomingConnectionsRequests,
  getOutgoingConnectionsRequests,
} from '../../api/connections';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { Connection, ConnectionType } from '../../api/types';
import AppHeader from '../../components/AppHeader';
import ConnectionListItem from '../../components/ConnectionListItem/ConnectionListItem';

export default function ConnectionsPage() {
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>();
  const [outgoingRequests, setOutgoingRequests] = useState<Connection[]>();
  const [connections, setConnections] = useState<Connection[]>();
  const handleApiRequestError = useApiRequestErrorHandler();
  //TODO: add filtering and sorting

  // shoot api query before painting to screen
  useEffect(() => {
    getIncomingConnectionsRequests().then(
      (incoming) => {
        console.log(incoming);
        setIncomingRequests(incoming);
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
    getOutgoingConnectionsRequests().then(
      (ougoing) => {
        console.log(ougoing);
        setOutgoingRequests(ougoing);
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
    getConnections().then(
      (connections) => {
        console.log(connections);
        setConnections(connections);
      },
      (error) => {
        handleApiRequestError(error);
      }
    );
  }, []);
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
