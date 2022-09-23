import {
  IonCard,
  IonCardContent,
  IonHeader,
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
  const [isSearching, setIsSearching] = useState<boolean>(false);

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
    if (target.value) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    getPageOfConnectionsOnSearch(target.value ? target.value : '');
  }

  useLayoutEffect(() => {
    getInitialConnections();
  }, []);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            debounce={800}
            onIonChange={handleSearchbarChange}
            placeholder="Name or Module Code"
          />
        </IonToolbar>
      </IonHeader>
      {Object.keys(connections).length > 0 || isSearching ? (
        <>
          <IonList lines="full">
            {Object.values(connections).map((connection) => (
              <ConnectionListItem
                connection={connection}
                connectionType={connectionType}
                inList={true}
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
            <h2>You don't have any connections!</h2>
          </IonCardContent>
        </IonCard>
      )}
      <IonLoading isOpen={isLoading}></IonLoading>
    </>
  );
}
