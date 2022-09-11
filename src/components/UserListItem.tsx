import { IonAvatar, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { ConnectionStatus, User } from '../api/types';

interface UserListItemProps {
  user: User;
}

function ConnectionButton({
  connectionStatus,
}: {
  connectionStatus: ConnectionStatus;
}) {
  if (connectionStatus === ConnectionStatus.PENDING) {
    return <IonButton color="warning">Pending</IonButton>;
  } else if (connectionStatus === ConnectionStatus.CONNECTED) {
    return (
      <IonButton color="success">
        Connected <IonIcon icon={checkmarkCircle} />
      </IonButton>
    );
  } else if (connectionStatus === ConnectionStatus.NOT_CONNECTED) {
    return <IonButton>Connect</IonButton>;
  } else {
    return null;
  }
}

/**
 * Takes in a User object and creates a user list item for use in lists.
 */
export default function UserListItem({ user }: UserListItemProps) {
  return (
    <IonItem className="user-list-item">
      <IonAvatar slot="start">
        <img
          alt="user thumbnail"
          src={
            user.thumbnailPic
              ? user.thumbnailPic
              : 'assets/user_default_icon.svg'
          }
        ></img>
      </IonAvatar>
      <IonLabel>
        <h2>{user.name}</h2>
        {user.userStatus ? <p>{user.userStatus}</p> : null}
      </IonLabel>
      <ConnectionButton
        connectionStatus={user.connectionStatus}
      ></ConnectionButton>
    </IonItem>
  );
}
