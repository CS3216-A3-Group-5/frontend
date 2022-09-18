import { Redirect, Route } from 'react-router-dom';
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
import RegisterPage from './pages/authentication/register';
import LoginPage from './pages/authentication/login';
import VerifyPage from './pages/authentication/verify';
import EditProfile from './pages/user_profile/edit_profile';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/verify">
              <VerifyPage />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route path="/home/modules/:moduleCode" component={ModuleView} />
            <Route exact path="/modules">
              <ModulesPage />
            </Route>
            <Route path="/modules/:moduleCode" component={ModuleView} />
            <Route path="/notifications">
              <NotificationsPage />
            </Route>
            <Route exact path="/user_profile">
              <UserProfile />
            </Route>
            <Route exact path="/user_profile/edit" component={EditProfile} />
            <Route path="/connections">
              <ConnectionsPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="modules" href="/modules">
              <IonIcon icon={searchOutline} />
              <IonLabel className={styles['tab_button_text']}>Modules</IonLabel>
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
              <IonLabel className={styles['tab_button_text']}>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
