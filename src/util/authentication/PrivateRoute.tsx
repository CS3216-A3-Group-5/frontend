import { Redirect, Route, RouteProps } from 'react-router-dom';
import { LOGIN } from '../../routes';
import { useAuth } from './AuthContext';

/**
 * Wrapper for routes that need to be protected by authentication.
 */
export default function PrivateRoute(props: RouteProps) {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Route {...props} />;
  } else {
    return (
      <Route>
        <Redirect to={LOGIN}></Redirect>
      </Route>
    );
  }
}
