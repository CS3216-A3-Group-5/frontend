import {
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSearchbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useApiRequestErrorHandler } from '../../../api/errorHandling';
import { User } from '../../../api/types';
import AppHeader from '../../../components/AppHeader';
import UserListItem from '../../../components/UserListItem';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  DataRetrievalErrorType,
  getModuleStudents,
} from '../../../redux/slices/objectDetailsSlice';
import useConnectionIssueToast from '../../../util/hooks/useConnectionIssueToast';
import useErrorToast from '../../../util/hooks/useErrorToast';

/**
 * Page to view full details of an enrolled university module.
 */
export default function ModuleView({
  match,
}: RouteComponentProps<{ moduleCode: string }>) {
  const dispatch = useAppDispatch();
  const [students, setStudents] = useState<User[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentConnectionIssueToast = useConnectionIssueToast();
  const presentErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();
  const module = useAppSelector((state) => state.home.modules)[
    match.params.moduleCode
  ];

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
      })
      .catch((error) => {
        presentErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  // shoot api query to get list of students of this module before paint
  useLayoutEffect(() => {
    getStudents();
  }, [match.params.moduleCode]);

  return (
    <IonPage>
      <AppHeader />
      <IonContent fullscreen>
        <h1 className="ion-padding-start">{module.code}</h1>
        <h4 className="ion-padding-start">{module.name}</h4>
        <IonListHeader>
          <IonLabel>
            <h1>Students</h1>
          </IonLabel>
        </IonListHeader>
        <IonSearchbar />
        <IonList className="ion-no-padding">
          {students
            ? students.map((user) => (
                <UserListItem user={user} key={user.id} module={module.code} />
              ))
            : null}
        </IonList>
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonPage>
  );
}
