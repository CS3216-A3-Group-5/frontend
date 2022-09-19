import { Redirect, Route, RouteProps } from 'react-router-dom';
import { HOME } from '../../routes';
import { useAuth } from './AuthContext';

/**
 * Wrapper for routes that should only be accessible to non authenticated users.
 * This will cause redirecting to home page if authenticated user tries to access the wrapped page.
 */
export default function NonAuthRoute(props: RouteProps) {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Route {...props} />;
  } else {
    return (
      <Route>
        <Redirect to={HOME}></Redirect>
      </Route>
    );
  }
}
