import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Wrapper for routes that need to be protected by authentication.
 */
export function PrivateRoute(props: RouteProps) {
  const auth = useAuth();
  console.log(auth.isAuthenticated);
  if (auth.isAuthenticated) {
    return <Route {...props} />;
  } else {
    return (
      <Route>
        <Redirect to={'/login'}></Redirect>
      </Route>
    );
  }
}
