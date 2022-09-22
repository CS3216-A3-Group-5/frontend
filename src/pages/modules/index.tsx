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
import { useState } from 'react';
import { useLocation } from 'react-router';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import AppHeader from '../../components/AppHeader';
import { PAGE_SIZE } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  getNewPageOfExploreModules,
  getPageOfExploreModulesWithNewKeyword,
} from '../../redux/slices/modulesSlice';
import { useCheckUserProfileCreated } from '../../util/hooks/useCheckUserProfileCreated';
import useErrorToast from '../../util/hooks/useErrorToast';
import useInfoToast from '../../util/hooks/useInfoToast';
import useVerifyAuthenticationThenLoadData from '../../util/hooks/useVerifyAuthenticationThenLoadData';
import ModuleListItem from './ModuleListItem/ModuleListItem';

export default function ModulesPage() {
  const currentPath = useLocation().pathname;
  const modules = useAppSelector((state) => state.modules.modules);
  const [isInfiniteScrollDisabled, setIsInfiniteScrollDisabled] =
    useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const dispatch = useAppDispatch();
  const createErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasDoneFirstLoad, setHasDoneFirstLoad] = useState<boolean>(false);

  useCheckUserProfileCreated();

  /* eslint-disable */
  function getNewPageOfModules(e: any) {
    dispatch(getNewPageOfExploreModules())
      .unwrap()
      .then((addedModules) => {
        if (addedModules.length <= 0) {
          presentInfoToast('No more modules to display');
        }
      })
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        e.target.complete();
      });
  }

  function getPageOfModulesOnSearch(keyword?: string | null) {
    setIsLoading(true);
    dispatch(getPageOfExploreModulesWithNewKeyword(keyword))
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

  function getInitialExploreModules() {
    setIsLoading(true);
    dispatch(getPageOfExploreModulesWithNewKeyword(''))
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
      .finally(() => {
        setIsLoading(false);
        setHasDoneFirstLoad(true);
      });
  }

  useVerifyAuthenticationThenLoadData(getInitialExploreModules);

  return (
    <IonPage>
      <AppHeader>
        <IonToolbar>
          <IonSearchbar
            debounce={800}
            onIonChange={handleSearchbarChange}
            placeholder="Module code or title"
          />
        </IonToolbar>
      </AppHeader>
      <IonContent fullscreen>
        <IonListHeader className="ion-padding-top">
          <IonLabel>
            <h1>Explore modules</h1>
          </IonLabel>
        </IonListHeader>
        {hasDoneFirstLoad &&
          (Object.keys(modules).length > 0 ? (
            <>
              <IonList lines="full">
                {Object.values(modules).map((uniModule) => (
                  <ModuleListItem
                    uniModule={uniModule}
                    key={uniModule.code}
                    path={currentPath}
                    showEnrolledStatus
                  />
                ))}
              </IonList>
              <IonInfiniteScroll
                onIonInfinite={getNewPageOfModules}
                threshold="50px"
                disabled={isInfiniteScrollDisabled}
              >
                <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </>
          ) : (
            <IonCard color="secondary">
              <IonCardContent>
                <h2>No modules found.</h2>
              </IonCardContent>
            </IonCard>
          ))}
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonPage>
  );
}
