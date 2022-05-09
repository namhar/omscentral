import { logEvent } from '@firebase/analytics';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFirebase } from 'src/components/Firebase';
import Menu from 'src/components/Menu';
import { paths } from 'src/constants';

const UserMenu: React.FC = () => {
  const firebase = useFirebase();
  const history = useHistory();

  const handleLogoutClick = async () => {
    await firebase.auth.signOut();
    logEvent(firebase.analytics, 'logout');
    history.push(paths.login);
  };

  return (
    <Menu
      data-cy="user_menu"
      id="user_menu"
      icon={<AccountCircle data-cy="user_menu_icon" />}
      items={[
        {
          key: 'profile',
          path: paths.userProfile,
          caption: 'My Profile',
        },
        {
          key: 'subscription',
          path: paths.userSubscription,
          caption: 'My Subscription',
        },
        {
          key: 'reviews',
          path: paths.userReviews,
          caption: 'My Reviews',
        },
        {
          key: 'logout',
          onClick: handleLogoutClick,
          caption: 'Logout',
        },
      ]}
    />
  );
};

export default UserMenu;
