import { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { CREATE_PROFILE } from '../../routes';
import useInfoToast from './useInfoToast';

export function useCheckUserProfileCreated() {
  const history = useHistory();
  const presentInfoToast = useInfoToast();
  const hasCreatedProfile = useAppSelector(
    (state) => state.user.hasCreatedProfile
  );
  useLayoutEffect(() => {
    if (!hasCreatedProfile) {
      presentInfoToast('You have not created your profile yet!', 'secondary');
      history.replace(CREATE_PROFILE);
    }
  }, []);
}
