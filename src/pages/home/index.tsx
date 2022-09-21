import {
  IonCard,
  IonCardContent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApiRequestErrorHandler } from '../../api/errorHandling';

import AppHeader from '../../components/AppHeader';
import { PAGE_SIZE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getNewPageOfModules,
  getPageOfModulesWithNewKeyword,
} from '../../redux/slices/homeSlice';
import useErrorToast from '../../util/hooks/useErrorToast';
import useInfoToast from '../../util/hooks/useInfoToast';
import ModuleListItem from '../modules/ModuleListItem';

export default function Homepage() {
  const modules = useAppSelector((state) => state.home.modules);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const createErrorToast = useErrorToast();
  const [isInfiniteScrollDisabled, setIsInfiniteScrollDisabled] =
    useState<boolean>(false);
  const handleApiError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch();

  function getPageOfModulesOnSearch(keyword?: string | null) {
    setIsLoading(true);
    dispatch(getPageOfModulesWithNewKeyword(keyword))
      .unwrap()
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleSearchbarChange(ev: Event) {
    const target = ev.target as HTMLIonSearchbarElement;
    getPageOfModulesOnSearch(target.value);
  }

  /* eslint-disable */
  function handleInfiniteScroll(ev: any) {
    dispatch(getNewPageOfModules())
      .unwrap()
      .then((addedModules) => {
        // check the length of addedModules, if they have not changed,
        // then no more data to fetch for this keyword.
        if (addedModules.length <= 0) {
          presentInfoToast('No more modules to display');
        }
      })
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        ev.target.complete();
      });
  }

  function getModulesOfUser() {
    setIsLoading(true);
    dispatch(getPageOfModulesWithNewKeyword())
      .unwrap()
      .then((addedModules) => {
        // disable infinite scroll if initial data is already less than a page size
        if (addedModules.length < PAGE_SIZE) {
          setIsInfiniteScrollDisabled(true);
        }
      })
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
          <IonSearchbar debounce={1000} onIonChange={handleSearchbarChange} />
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
        <IonInfiniteScroll
          onIonInfinite={handleInfiniteScroll}
          threshold="50px"
          disabled={isInfiniteScrollDisabled}
        >
          <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
      <IonLoading isOpen={isLoading} />
    </IonPage>
  );
}
