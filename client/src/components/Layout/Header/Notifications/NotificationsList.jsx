import { Strings } from 'support/Constants';

import { NotificationCard } from 'components/Card';
import Errorer from 'components/Errorer';

const NotificationsList = ({ notifications, lang }) => {
  return notifications.length ? (
    notifications.map(item => (
      <NotificationCard key={item._id} data={item} />
    ))
  ) : <Errorer message={Strings.noNotificationYet[lang]} />
}

export default NotificationsList;
