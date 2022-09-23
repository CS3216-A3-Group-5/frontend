import {
  AlertButton,
  IonAlert,
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import Fuse from 'fuse.js';
import { helpCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { User, UserStatus } from '../../../api/types';
import { enrollModule, unenrollModule } from '../../../api/users';
import AppHeader from '../../../components/AppHeader';
import UserListItem from '../../../components/UserListItem';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getModuleStudents,
  DataRetrievalErrorType,
} from '../../../redux/slices/objectDetailsSlice';
import {
  getUserStatusForModule,
  setModuleEnrollStatus,
  updateUserStatusForModule,
} from '../../../redux/slices/userSlice';
import { useCheckUserProfileCreated } from '../../../util/hooks/useCheckUserProfileCreated';
import useConnectionIssueToast from '../../../util/hooks/useConnectionIssueToast';
import useErrorToast from '../../../util/hooks/useErrorToast';
import useVerifyAuthenticationThenLoadData from '../../../util/hooks/useVerifyAuthenticationThenLoadData';
import styles from './styles.module.scss';

const statusSubHeader =
  'Your status indicates to other students in this module whether you would like to connect with someone.';

const statusExplanation =
  'Looking for a friend: You are actively looking to connect with someone.<br><br>Willing To help: You are not actively looking, but would like others to connect with you.<br><br>No Status: You are not looking for connections at this time.';
/**
 * Page to view full details of an enrolled university module.
 */
export default function ModuleView({
  match,
}: RouteComponentProps<{ moduleCode: string }>) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentConnectionIssueToast = useConnectionIssueToast();
  const presentErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();
  const module = useAppSelector((state) => state.home.modules)[
    match.params.moduleCode
  ];
  const userStatus = useAppSelector(
    (state) => state.user.moduleStatuses[module.code]
  ); //eslint-disable-line
  const [isEnrolled, setIsEnrolled] = useState<boolean>(module.isEnrolled);
  const [isStatusExplanationShowing, setIsStatusExplanationShowing] =
    useState<boolean>(false);

  const [isUnenrollAlertShowing, setIsUnenrollAlertShowing] =
    useState<boolean>(false);
  const [fuse, setFuse] = useState<Fuse<User>>();
  const [students, setStudents] = useState<User[]>();
  const [filteredUsers, setFilteredUsers] = useState<User[]>();

  useCheckUserProfileCreated();

  function getStudents() {
    setIsLoading(true);
    dispatch(getModuleStudents(module.code))
      .unwrap()
      .then((returnObject) => {
        if (returnObject.errorType !== DataRetrievalErrorType.NONE) {
          // couldnt get fresh data from server
          presentConnectionIssueToast(returnObject.errorType);
        }
        setStudents(returnObject.data);
        setFilteredUsers(returnObject.data);
        setFuse(
          new Fuse(returnObject.data, {
            keys: [
              'name',
              { name: 'connectionStatus', weight: 3 },
              { name: 'userStatus', weight: 3 },
              { name: 'universityCourse', weight: 3 },
            ],
            includeScore: true,
            sortFn: (a, b) => a.score - b.score,
            threshold: 0.2,
          })
        );
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  function submitUserEnrollRequest() {
    setIsLoading(true);
    enrollModule(module.code)
      .then(() => {
        setIsEnrolled(true);
        dispatch(
          setModuleEnrollStatus({
            moduleCode: module.code,
            status: UserStatus.NO_STATUS,
          })
        );
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function submitUserUnenrollRequest() {
    setIsLoading(true);
    unenrollModule(module.code)
      .then(() => {
        setIsEnrolled(false);
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function getUserStatus() {
    dispatch(getUserStatusForModule(module.code))
      .unwrap()
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      });
  }

  function updateStatus(status: UserStatus) {
    setIsLoading(true);
    dispatch(
      updateUserStatusForModule({ moduleCode: module.code, newStatus: status })
    )
      .unwrap()
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useVerifyAuthenticationThenLoadData(() => {
    getStudents();
    getUserStatus();
  });

  // user status interface stuff
  function getSelectInterfaceType() {
    if (isPlatform('mobile')) {
      return 'action-sheet';
    } else {
      return 'popover';
    }
  }

  /* eslint-disable */
  function onSelectionChange(e: any) {
    updateStatus(e.target.value);
  }

  function handleSearchbarChange(ev: Event) {
    const target = ev.target as HTMLIonSearchbarElement;
    let results: User[] = [];
    if (!target.value || target.value === '') {
      results = students!;
    } else if (fuse) {
      results = fuse
        .search(target.value ? target.value : '')
        .map((record) => record.item);
    }
    setFilteredUsers(results);
  }

  // unenroll alert stuff
  const unenrollAlertButtons: Array<AlertButton> = [
    {
      text: 'Cancel',
      handler: () => {
        setIsUnenrollAlertShowing(false);
      },
    },
    {
      text: 'Ok',
      handler: () => {
        submitUserUnenrollRequest();
      },
    },
  ];

  return (
    <IonPage>
      <AppHeader
        button={
          isEnrolled && (
            <>
              <IonButton
                fill="clear"
                onClick={() => {
                  setIsUnenrollAlertShowing(true);
                }}
              >
                Unenroll
              </IonButton>
              <IonAlert
                isOpen={isUnenrollAlertShowing}
                header="Are you sure?"
                subHeader="You will no longer be seen as a student of this module."
                onDidDismiss={() => {
                  setIsUnenrollAlertShowing(false);
                }}
                buttons={unenrollAlertButtons}
              ></IonAlert>
            </>
          )
        }
      />
      <IonContent fullscreen>
        <IonToolbar>
          <div className={styles['header-enroll-container']}>
            <div className={styles['header-text']}>
              {module.code}
              <h4>{module.name}</h4>
            </div>
          </div>
          {isEnrolled && (
            <div className={styles['user-status-container']}>
              <div>My status:</div>
              <IonSelect
                interface={getSelectInterfaceType()}
                selectedText={userStatus}
                onIonChange={onSelectionChange}
              >
                <IonSelectOption color="medium">
                  {UserStatus.LOOKING_FOR_A_FRIEND}
                </IonSelectOption>
                <IonSelectOption>{UserStatus.WILLING_TO_HELP}</IonSelectOption>
                <IonSelectOption>{UserStatus.NO_STATUS}</IonSelectOption>
              </IonSelect>
              <IonButton
                fill="clear"
                onClick={() => {
                  setIsStatusExplanationShowing(true);
                }}
              >
                <IonIcon icon={helpCircleOutline} />
              </IonButton>
              <IonAlert
                isOpen={isStatusExplanationShowing}
                header="What is a status?"
                subHeader={statusSubHeader}
                message={statusExplanation}
                onDidDismiss={() => {
                  setIsStatusExplanationShowing(false);
                }}
                buttons={['OK']}
              ></IonAlert>
            </div>
          )}
        </IonToolbar>
        <IonListHeader>
          <IonLabel>
            <h1>Students</h1>
          </IonLabel>
        </IonListHeader>
        <IonSearchbar
          debounce={800}
          onIonChange={handleSearchbarChange}
          placeholder="Name, university course or status"
        />
        <IonList className="ion-no-padding">
          {filteredUsers
            ? filteredUsers.map((user) => (
                <UserListItem user={user} key={user.id} module={module.code} />
              ))
            : null}
        </IonList>
      </IonContent>
      <IonLoading isOpen={isLoading}></IonLoading>
      {!isEnrolled && (
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={submitUserEnrollRequest}>
              Enroll
            </IonButton>
          </IonToolbar>
        </IonFooter>
      )}
    </IonPage>
  );
}
