import { IonAvatar, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { getFullURL } from '../../api';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { Connection, ConnectionType } from '../../api/types';
import { useAppDispatch } from '../../redux/hooks';
import {
  acceptIncomingInList,
  cancelOutgoingInList,
  rejectIncomingInList,
} from '../../redux/slices/connectionListSlice';
import {
  acceptIncoming,
  cancelOutgoing,
  rejectIncoming,
} from '../../redux/slices/connectionsSlice';
import useErrorToast from '../../util/hooks/useErrorToast';

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
  const handleApiRequestError = useApiRequestErrorHandler();

  function acceptIncomingRequest() {
    if (inList) {
      dispatch(acceptIncomingInList(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    } else {
      dispatch(acceptIncoming(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    }
  }

  function rejectIncomingRequest() {
    if (inList) {
      dispatch(rejectIncomingInList(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    } else {
      dispatch(rejectIncoming(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    }
  }

  function cancelOutgoingRequest() {
    if (inList) {
      dispatch(cancelOutgoingInList(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    } else {
      dispatch(cancelOutgoing(connection)).catch((error) => {
        presentErrorToast(handleApiRequestError(error));
      });
    }
  }

  if (connectionType === ConnectionType.CONNECTED) {
    return <IonIcon color="success" src={checkmarkCircle}></IonIcon>;
  } else if (connectionType == ConnectionType.INCOMING_REQUEST) {
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
  } else if (connectionType == ConnectionType.OUTGOING_REQUEST) {
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
  return (
    <IonItem className="connection-list-item">
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
  );
}
