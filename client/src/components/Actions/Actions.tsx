import BarChartIcon from '@material-ui/icons/BarChart';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
import HelpIcon from '@material-ui/icons/Help';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { paths, urls } from 'src/constants';

import { AuthContext } from '../Auth';
import { NotificationContext } from '../Notification';
import { useStyles } from './Actions.styles';

enum ActionKey {
  CreateReview = 'create_review',
  OpenTableau = 'open_tableau',
  ReportIssue = 'report_issue',
  GetSupport = 'get_support',
}

interface Action {
  key: ActionKey;
  auth?: boolean;
  name: string;
  icon: JSX.Element;
}

const actions: Action[] = [
  {
    key: ActionKey.CreateReview,
    auth: true,
    name: 'Create Review',
    icon: <EditIcon />,
  },
  {
    key: ActionKey.OpenTableau,
    name: 'Tableau Grade Reports',
    icon: <BarChartIcon />,
  },
  {
    key: ActionKey.ReportIssue,
    name: 'Report Issue',
    icon: <BugReportIcon />,
  },
  {
    key: ActionKey.GetSupport,
    name: 'Get Support',
    icon: <HelpIcon />,
  },
];

const Actions: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext)!;
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (action: Action) => () => {
    if (action.auth && !auth.authenticated) {
      notification.warning('You must login first to publish reviews.');
      return history.push(paths.login);
    }

    setOpen(false);
    switch (action.key) {
      case ActionKey.CreateReview:
        return history.push(paths.review.create);
      case ActionKey.OpenTableau:
        return window.open(urls.tableau);
      case ActionKey.ReportIssue:
        return window.open(urls.bugs);
      default:
        return;
    }
  };

  return (
    <div className={classes.root}>
      <SpeedDial
        data-cy="actions"
        ariaLabel="actions"
        icon={<SpeedDialIcon />}
        direction="up"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        {actions.map((action) => (
          <SpeedDialAction
            data-cy={`action:${action.key}`}
            key={action.key}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClick(action)}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default Actions;
