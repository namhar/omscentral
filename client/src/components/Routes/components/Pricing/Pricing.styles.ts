import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  section: {
    //
  },
  active: {
    borderColor: theme.palette.primary.dark,
  },
  cardHeader: {
    paddingTop: theme.spacing(3),
  },
  primaryAction: {},
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(2),
  },
}));
