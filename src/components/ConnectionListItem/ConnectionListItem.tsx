import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonToolbar,
} from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import React, { useState } from 'react';
import { getFullURL } from '../../api';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { Connection, ConnectionType, DetailedUser } from '../../api/types';
import { useAppDispatch } from '../../redux/hooks';
import {
  acceptIncomingInList,
  cancelOutgoingInList,
  deleteConnectedInList,
  rejectIncomingInList,
} from '../../redux/slices/connectionListSlice';
import {
  acceptIncoming,
  cancelOutgoing,
  deleteConnected,
  rejectIncoming,
} from '../../redux/slices/connectionsSlice';
import {
  DataRetrievalErrorType,
  getUserDetails,
} from '../../redux/slices/objectDetailsSlice';
import useConnectionIssueToast from '../../util/hooks/useConnectionIssueToast';
import useErrorToast from '../../util/hooks/useErrorToast';
import UserCardItem from '../UserCardItem/UserCardItem';

interface ConnectionListItemProps {
  connection: Connection;
  connectionType: ConnectionType;
  inList: boolean;
}

function ConnectionAction({
  connection,
  connectionType,
  inList,
}: ConnectionListItemProps) {
  const dispatch = useAppDispatch();
  const presentErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();

  function acceptIncomingRequest(
    event: React.MouseEvent<HTMLIonButtonElement>
  ) {
    event.stopPropagation();
    if (inList) {
      dispatch(acceptIncomingInList(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    } else {
      dispatch(acceptIncoming(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    }
  }

  function rejectIncomingRequest(
    event: React.MouseEvent<HTMLIonButtonElement>
  ) {
    event.stopPropagation();
    if (inList) {
      dispatch(rejectIncomingInList(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    } else {
      dispatch(rejectIncoming(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    }
  }

  function cancelOutgoingRequest(
    event: React.MouseEvent<HTMLIonButtonElement>
  ) {
    event.stopPropagation();
    if (inList) {
      dispatch(cancelOutgoingInList(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    } else {
      dispatch(cancelOutgoing(connection)).catch((error) => {
        presentErrorToast(handleApiError(error));
      });
    }
  }

  if (connectionType === ConnectionType.CONNECTED) {
    return <IonIcon color="success" src={checkmarkCircle}></IonIcon>;
  } else if (connectionType === ConnectionType.INCOMING_REQUEST) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IonButton color="success" onClick={acceptIncomingRequest}>
          Accept
        </IonButton>
        <IonButton color="danger" onClick={rejectIncomingRequest}>
          Reject
        </IonButton>
      </div>
    );
  } else if (connectionType === ConnectionType.OUTGOING_REQUEST) {
    return (
      <IonButton color="danger" onClick={cancelOutgoingRequest}>
        Cancel
      </IonButton>
    );
  } else {
    return null;
  }
}

/**
 * Takes in a User object and creates a user list item for use in lists.
 */
export default function ConnectionListItem({
  connection,
  connectionType,
  inList,
}: ConnectionListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<DetailedUser>();
  const presentConnectionIssueToast = useConnectionIssueToast();
  const presentErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();

  const dispatch = useAppDispatch();

  function seeUserDetails() {
    setIsLoading(true);
    dispatch(getUserDetails(connection.otherUser.id))
      .unwrap()
      .then((returnObject) => {
        if (returnObject.errorType !== DataRetrievalErrorType.NONE) {
          presentConnectionIssueToast(returnObject.errorType);
        }
        setUserDetails(returnObject.data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  function deleteConnection() {
    setIsLoading(true);
    if (inList) {
      dispatch(deleteConnectedInList(connection))
        .catch((error) => {
          presentErrorToast(handleApiError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      dispatch(deleteConnected(connection))
        .catch((error) => {
          presentErrorToast(handleApiError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    setIsModalOpen(false);
  }

  return (
    <div>
      <IonItem button onClick={seeUserDetails}>
        <IonAvatar slot="start">
          <img
            alt="user thumbnail"
            src={
              connection.otherUser.thumbnailPic
                ? getFullURL(connection.otherUser.thumbnailPic)
                : 'assets/user_default_icon.svg'
            }
          ></img>
        </IonAvatar>
        <IonLabel>
          <h2>{connection.otherUser.name}</h2>
          <h3>{connection.uniModule.code}</h3>
        </IonLabel>
        <ConnectionAction
          connection={connection}
          connectionType={connectionType}
          inList={inList}
        />
      </IonItem>

      <IonLoading isOpen={isLoading}></IonLoading>

      <IonModal
        isOpen={isModalOpen}
        onWillDismiss={() => setIsModalOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton slot="start" onClick={() => setIsModalOpen(false)}>
                Back
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <UserCardItem user={userDetails!} />
        {connectionType === ConnectionType.CONNECTED && (
          <IonButton
            class="ion-padding-horizontal"
            color="danger"
            onClick={deleteConnection}
          >
            Delete connection
          </IonButton>
        )}
      </IonModal>
    </div>
  );
}
