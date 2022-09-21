import {
  IonCard,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonLoading,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { ConnectionType } from '../../api/types';
import { PAGE_SIZE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getNewPageOfConnections,
  getPageOfConnectionsWithNewKeyword,
  resetConnections,
  setListType,
} from '../../redux/slices/connectionListSlice';
import useErrorToast from '../../util/hooks/useErrorToast';
import useInfoToast from '../../util/hooks/useInfoToast';
import ConnectionListItem from '../ConnectionListItem/ConnectionListItem';

interface ConnectionInfiniteListProps {
  connectionType: ConnectionType;
}

export default function ConnectionInfiniteList({
  connectionType,
}: ConnectionInfiniteListProps) {
  const connections = useAppSelector(
    (state) => state.connectionList.connections
  );
  const [isInfiniteScrollDisabled, setIsInfiniteScrollDisabled] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const dispatch = useAppDispatch();
  const createErrorToast = useErrorToast();
  const handleApiError = useApiRequestErrorHandler();

  function getInitialConnections() {
    setIsLoading(true);
    dispatch(setListType(connectionType));
    dispatch(resetConnections());
    dispatch(getPageOfConnectionsWithNewKeyword(''))
      .unwrap()
      .then((addedConnections) => {
        // disable infinite scroll if initial data is already less than a page size
        if (addedConnections.length < PAGE_SIZE) {
          setIsInfiniteScrollDisabled(true);
        }
      })
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => setIsLoading(false));
  }

  /* eslint-disable */
  function loadNewPageOfConnections(e: any) {
    dispatch(getNewPageOfConnections())
      .unwrap()
      .then((addedConnections) => {
        if (addedConnections.length <= 0) {
          presentInfoToast('No more connections to display');
        }
      })
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        e.target.complete();
      });
  }

  function getPageOfConnectionsOnSearch(keyword?: string) {
    setIsLoading(true);
    dispatch(getPageOfConnectionsWithNewKeyword(keyword))
      .catch((error) => {
        createErrorToast(handleApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleSearchbarChange(ev: Event) {
    const target = ev.target as HTMLIonSearchbarElement;
    getPageOfConnectionsOnSearch(target.value ? target.value : '');
  }

  useLayoutEffect(() => {
    // get initial page of modules, default is ordered by alphabet from backend
    getInitialConnections();
  }, []);

  return (
    <>
      <IonToolbar>
        <IonSearchbar debounce={1000} onIonChange={handleSearchbarChange} />
      </IonToolbar>
      {Object.keys(connections).length > 0 ? (
        <>
          <IonList lines="full">
            {Object.values(connections).map((connection) => (
              <ConnectionListItem
                connection={connection}
                connectionType={connectionType}
                key={connection.id}
              />
            ))}
          </IonList>
          <IonInfiniteScroll
            onIonInfinite={loadNewPageOfConnections}
            threshold="50px"
            disabled={isInfiniteScrollDisabled}
          >
            <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </>
      ) : (
        <IonCard color="secondary">
          <IonCardContent>
            <h2>No connections found.</h2>
          </IonCardContent>
        </IonCard>
      )}
      <IonLoading isOpen={isLoading}></IonLoading>
    </>
  );
}
