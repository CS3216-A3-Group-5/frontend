import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { StaticRouter, useLocation } from 'react-router-dom';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { sampleModuleData } from '../../api/sampleData';
import { UniModule } from '../../api/types';
import AppHeader from '../../components/AppHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getModules } from '../../redux/slices/homeSlice';
import useErrorToast from '../../util/hooks/useErrorToast';
import ModuleListItem from '../modules/ModuleListItem';

export default function Homepage() {
  const modules = useAppSelector((state) => state.home.modules);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch();

  function getModulesOfUser() {
    setIsLoading(true);
    dispatch(getModules())
      .unwrap()
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  // load modules before first paint
  useLayoutEffect(() => {
    getModulesOfUser();
  }, []);

  const currentPath = useLocation().pathname;
  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        <IonListHeader className="ion-padding-top">
          <IonLabel>
            <h1>My Modules</h1>
          </IonLabel>
        </IonListHeader>
        <IonList lines="full">
          {Object.keys(modules).length === 0 ? (
            <IonCard color="secondary">
              <IonCardContent>
                <h2>You are not enrolled in any modules!</h2>
              </IonCardContent>
            </IonCard>
          ) : (
            Object.values(modules).map((uniModule) => (
              <ModuleListItem
                uniModule={uniModule}
                key={uniModule.code}
                path={currentPath + '/modules'}
              />
            ))
          )}
        </IonList>
        <IonLoading isOpen={isLoading ? true : false} />
      </IonContent>
    </IonPage>
  );
}
