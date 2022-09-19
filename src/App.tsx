import { Redirect } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, searchOutline, person, people } from 'ionicons/icons';
import Home from './pages/home';
import ModulesPage from './pages/modules';
import NotificationsPage from './pages/notifications';
import UserProfile from './pages/user_profile';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import styles from './styles.module.scss';

import ConnectionsPage from './pages/connections';
import ModuleView from './pages/modules/ModuleView';
import EditProfile from './pages/user_profile/edit_profile';
import { AuthContext, useProvideAuth } from './util/authentication/AuthContext';
import { useLayoutEffect } from 'react';
import { verifyAuth } from './api/authentication';
import PrivateRoute from './util/authentication/PrivateRoute';
import { LOGIN, REGISTER, VERIFY_EMAIL } from './routes';
import LoginPage from './pages/authentication/login';
import NonAuthRoute from './util/authentication/NonAuthRoute';
import RegisterPage from './pages/authentication/register';
import VerifyPage from './pages/authentication/verify';

setupIonicReact();

export default function App() {
  const authenticatedUser = useProvideAuth();

  // before app first renders, check authentication with backend
  // TODO: show old data if unable to establish connection to backend!
  useLayoutEffect(() => {
    void verifyAuth().then((val) => {
      authenticatedUser.setIsAuthenticated(val);
    });
  }, []);

  return (
    <IonApp>
      <AuthContext.Provider value={authenticatedUser}>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <NonAuthRoute exact path={LOGIN}>
                <LoginPage />
              </NonAuthRoute>
              <NonAuthRoute exact path={REGISTER}>
                <RegisterPage />
              </NonAuthRoute>
              <NonAuthRoute exact path={VERIFY_EMAIL}>
                <VerifyPage />
              </NonAuthRoute>
              <PrivateRoute exact path="/home">
                <Home />
              </PrivateRoute>
              <PrivateRoute
                path="/home/modules/:moduleCode"
                component={ModuleView}
              />
              <PrivateRoute exact path="/modules">
                <ModulesPage />
              </PrivateRoute>
              <PrivateRoute
                path="/modules/:moduleCode"
                component={ModuleView}
              />
              <PrivateRoute path="/notifications">
                <NotificationsPage />
              </PrivateRoute>
              <PrivateRoute exact path="/user_profile">
                <UserProfile />
              </PrivateRoute>
              <PrivateRoute
                exact
                path="/user_profile/edit"
                component={EditProfile}
              />
              <PrivateRoute exact path="/connections">
                <ConnectionsPage />
              </PrivateRoute>
              <PrivateRoute exact path="/">
                <Redirect to="/home" />
              </PrivateRoute>
            </IonRouterOutlet>
            <IonTabBar
              slot="bottom"
              className={authenticatedUser.isAuthenticated ? '' : 'ion-hide'}
            >
              <IonTabButton tab="modules" href="/modules">
                <IonIcon icon={searchOutline} />
                <IonLabel className={styles['tab_button_text']}>
                  Modules
                </IonLabel>
              </IonTabButton>
              <IonTabButton tab="connections" href="/connections">
                <IonIcon icon={people}></IonIcon>
                <IonLabel className={styles['tab_button_text']}>
                  Connections
                </IonLabel>
              </IonTabButton>
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home}></IonIcon>
                <IonLabel className={styles['tab_button_text']}>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="userProfile" href="/user_profile">
                <IonIcon icon={person} />
                <IonLabel className={styles['tab_button_text']}>
                  Profile
                </IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
}
