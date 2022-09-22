import { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { verifyAuth } from '../../api/authentication';
import { useApiRequestErrorHandler } from '../../api/errorHandling';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setIsLoggedIn } from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { HOME } from '../../routes';
import useInfoToast from './useInfoToast';

export function useCheckAuthAndRedirect() {
  const history = useHistory();
  const handleApiError = useApiRequestErrorHandler();
  const dispatch = useAppDispatch();
  const presentInfoToast = useInfoToast();
  const isLoggedInPreviously = useAppSelector((state) => state.user.isLoggedIn);
  useLayoutEffect(() => {
    verifyAuth()
      .then((result) => {
        if (result === false) {
          void persistor.purge();
          dispatch(setIsLoggedIn(false));
          return;
        }
        // we are authenticated
        dispatch(setIsLoggedIn(true));
        history.replace(HOME);
      })
      .catch((err) => {
        //any other error other than 401 will allow access, but offline data only
        handleApiError(err);
        //if (error.errorType !== ErrorType.AUTHENTICATION_FAIL) {
        presentInfoToast(
          'Unable to reach server. Displaying offline information.'
        );
        if (isLoggedInPreviously) {
          history.replace(HOME);
        }
      });
  }, []);
}
