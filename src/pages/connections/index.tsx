import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonModal,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useState, useLayoutEffect } from 'react';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { ConnectionType } from '../../api/types';
import AppHeader from '../../components/AppHeader';
import ConnectionInfiniteList from '../../components/ConnectionInfiniteList';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalConnectionType, setModalConnectionType] =
    useState<ConnectionType>(ConnectionType.CONNECTED);
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
          <ConnectionListHeader
            header_type={ConnectionType.INCOMING_REQUEST}
            setIsModalOpen={setIsModalOpen}
            setModalConnectionType={setModalConnectionType}
          />
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
          <ConnectionListHeader
            header_type={ConnectionType.OUTGOING_REQUEST}
            setIsModalOpen={setIsModalOpen}
            setModalConnectionType={setModalConnectionType}
          />
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
          <ConnectionListHeader
            header_type={ConnectionType.CONNECTED}
            setIsModalOpen={setIsModalOpen}
            setModalConnectionType={setModalConnectionType}
          />
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
        <ConnectionInfiniteListModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          connectionType={modalConnectionType}
        />
      </IonContent>
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonPage>
  );
}

interface ConnectionListHeaderProps {
  header_type: ConnectionType;
  setModalConnectionType: (type: ConnectionType) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

function ConnectionListHeader({
  header_type,
  setModalConnectionType,
  setIsModalOpen,
}: ConnectionListHeaderProps) {
  const header: string =
    header_type == ConnectionType.CONNECTED
      ? 'Connected'
      : header_type == ConnectionType.INCOMING_REQUEST
      ? 'Incoming Request'
      : 'Outgoing Request';

  function openModal() {
    setModalConnectionType(header_type);
    setIsModalOpen(true);
  }

  return (
    <IonListHeader className="ion-padding-top">
      <IonLabel>
        <h2>{header}</h2>
      </IonLabel>
      <IonButton color="medium" onClick={openModal}>
        View All
      </IonButton>
    </IonListHeader>
  );
}

interface ConnectionInfiniteListModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  connectionType: ConnectionType;
}

function ConnectionInfiniteListModal({
  isModalOpen,
  setIsModalOpen,
  connectionType,
}: ConnectionInfiniteListModalProps) {
  return (
    <IonModal isOpen={isModalOpen} onWillDismiss={() => setIsModalOpen(false)}>
      <IonPage>
        <IonContent fullscreen>
          <IonHeader>
            <IonToolbar>
              <IonButtons>
                <IonButton slot="start" onClick={() => setIsModalOpen(false)}>
                  Back
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <ConnectionInfiniteList connectionType={connectionType} />
        </IonContent>
      </IonPage>
    </IonModal>
  );
}
