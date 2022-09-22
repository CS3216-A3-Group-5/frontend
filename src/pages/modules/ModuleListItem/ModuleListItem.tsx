import { IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { UniModule } from '../../../api/types';
import styles from './styles.module.scss';

interface ModuleListItemProps {
  uniModule: UniModule;
  // path to append module code to
  path: string;
  showEnrolledStatus?: boolean;
}

/**
 * Page to view full details of a university module.
 */
export default function ModuleListItem({
  uniModule,
  path,
  showEnrolledStatus,
}: ModuleListItemProps) {
  return (
    <IonItem routerLink={path + '/' + uniModule.code}>
      <IonLabel slot="start">
        <div className={styles['code-enroll-status-container']}>
          <h1>{uniModule.code}</h1>
          {showEnrolledStatus && uniModule.isEnrolled && (
            <IonIcon
              color="primary"
              className={styles['enrolled-icon']}
              icon={checkmarkCircle}
            ></IonIcon>
          )}
        </div>
        <p>{uniModule.name}</p>
      </IonLabel>
    </IonItem>
  );
}
