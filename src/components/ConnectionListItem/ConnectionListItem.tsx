import { IonAvatar, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { Connection, ConnectionType } from '../../api/types';

interface ConnectionListItemProps {
  connection: Connection;
  connectionType: ConnectionType;
}

function ConnectionAction({
  connectionType,
}: {
  connectionType: ConnectionType;
}) {
  if (connectionType == ConnectionType.CONNECTED) {
    return <IonIcon icon={checkmarkCircle} />;
  } else if (connectionType == ConnectionType.INCOMING_REQUEST) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IonButton color="success">Accept</IonButton>
        <IonButton color="danger">Reject</IonButton>
      </div>
    );
  } else if (connectionType == ConnectionType.OUTGOING_REQUEST) {
    return <IonButton color="danger">Cancel</IonButton>;
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
}: ConnectionListItemProps) {
  return (
    <IonItem className="connection-list-item">
      <IonAvatar slot="start">
        <img
          alt="user thumbnail"
          src={
            connection.otherUser.thumbnailPic
              ? connection.otherUser.thumbnailPic
              : 'assets/user_default_icon.svg'
          }
        ></img>
      </IonAvatar>
      <IonLabel>
        <h2>{connection.otherUser.name}</h2>
        <h3>{connection.uniModule.code}</h3>
      </IonLabel>
      <ConnectionAction connectionType={connectionType} />
    </IonItem>
  );
}
