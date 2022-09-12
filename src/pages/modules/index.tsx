import { IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router-dom';
import ModuleListView from './ModuleListView';
import ModuleView from './ModuleView';

export default function ModulesPage() {
  return (
    <IonRouterOutlet>
      <Route exact path="/modules" component={ModuleListView} />
      <Route path="/modules/:moduleCode" component={ModuleView} />
      <Route render={() => 'page not found'} />
    </IonRouterOutlet>
  );
}
