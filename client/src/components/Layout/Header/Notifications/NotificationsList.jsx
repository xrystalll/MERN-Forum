import { NotificationCard } from 'components/Card';
import Errorer from 'components/Errorer';

const NotificationsList = ({ notifications }) => {
  return notifications.length ? (
    notifications.map(item => (
      <NotificationCard key={item.id} data={item} />
    ))
  ) : (
    <Errorer message="No notification yet" />
  )
}

export default NotificationsList;
