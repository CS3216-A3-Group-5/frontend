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
import { checkmarkCircle, hourglass } from 'ionicons/icons';
import { useState } from 'react';
import { getFullURL } from '../../api';
import { createConnectionRequest } from '../../api/connections';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import {
  ConnectionStatus,
  DetailedUser,
  User,
  UserStatus,
} from '../../api/types';
import { useAppDispatch } from '../../redux/hooks';
import {
  DataRetrievalErrorType,
  getUserDetails,
} from '../../redux/slices/objectDetailsSlice';
import useConnectionIssueToast from '../../util/hooks/useConnectionIssueToast';
import useErrorToast from '../../util/hooks/useErrorToast';
import UserCardItem from '../UserCardItem/UserCardItem';
import styles from './style.module.scss';

interface UserListItemProps {
  user: User;
  module: string; // when viewing this user from a module page
}

/**
 * Returns icon to show beside name based on connection to that user.
 */
function renderConnectionStatusIcon(connectionStatus: ConnectionStatus) {
  switch (connectionStatus) {
    case ConnectionStatus.CONNECTED:
      return (
        <IonIcon
          className={styles['connection-status-icon']}
          color="primary"
          src={checkmarkCircle}
        ></IonIcon>
      );
    case ConnectionStatus.PENDING:
      return (
        <IonIcon
          className={styles['connection-status-icon']}
          color="warning"
          src={hourglass}
        ></IonIcon>
      );
    default:
      return null;
  }
}

/**
 * Takes in a User object and creates a user list item for use in lists.
 */
export default function UserListItem({ user, module }: UserListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<DetailedUser>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    user.connectionStatus
  );
  const presentConnectionIssueToast = useConnectionIssueToast();
  const presentErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();

  const dispatch = useAppDispatch();

  /**
   * Callback fired when a user list item is clicked.
   */
  function seeUserDetails() {
    setIsLoading(true);
    dispatch(getUserDetails(user.id))
      .unwrap()
      .then((returnObject) => {
        if (returnObject.errorType !== DataRetrievalErrorType.NONE) {
          // couldnt get fresh data from server
          presentConnectionIssueToast(returnObject.errorType);
        }
        setUserDetails({ userStatus: user.userStatus, ...returnObject.data });
        setIsModalOpen(true);
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  function onWillDismiss() {
    setIsModalOpen(false);
  }

  function onConnectionButtonPress(
    event: React.MouseEvent<HTMLIonButtonElement>
  ) {
    event.stopPropagation();
    setIsLoading(true);
    createConnectionRequest(user.id, module)
      .then((response) => {
        setConnectionStatus(response.otherUser.connectionStatus);
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div>
      <IonItem button className="user-list-item" onClick={seeUserDetails}>
        <IonAvatar slot="start" className={styles['avatar']}>
          <img
            alt="user thumbnail"
            src={
              user.thumbnailPic
                ? getFullURL(user.thumbnailPic)
                : 'assets/user_default_icon.svg'
            }
          ></img>
        </IonAvatar>
        <IonLabel>
          <div className={styles['name-label-container']}>
            <h1>{user.name}</h1>
            {renderConnectionStatusIcon(connectionStatus)}
          </div>
          <p>
            Y{new Date().getFullYear() - Number(user.matriculationYear) + 1}{' '}
            {user.universityCourse}
          </p>
          {user.userStatus && user.userStatus !== UserStatus.NO_STATUS ? (
            <p
              className={
                user.userStatus === UserStatus.LOOKING_FOR_A_FRIEND
                  ? styles['user-status-looking-for-friend']
                  : styles['user-status-willing-to-help']
              }
            >
              {user.userStatus}
            </p>
          ) : null}
        </IonLabel>
        {connectionStatus === ConnectionStatus.NOT_CONNECTED && (
          <IonButton
            size="default"
            color="primary"
            onClick={onConnectionButtonPress}
          >
            Connect
          </IonButton>
        )}
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonItem>
      <IonModal isOpen={isModalOpen} onWillDismiss={onWillDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton slot="start" onClick={() => setIsModalOpen(false)}>
                Back
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <UserCardItem user={userDetails!} module={module} />
      </IonModal>
    </div>
  );
}
