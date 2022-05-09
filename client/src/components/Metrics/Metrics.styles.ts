import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  cardContent: {
    padding: '0 !important',
  },
  metric: {
    textAlign: 'center',
    padding: theme.spacing(2, 2, 0, 2),
    borderRight: '1px solid #efefef',
    '&:last-child': {
      borderRight: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none',
      borderBottom: '1px solid #efefef',
      '&:last-child': {
        borderBottom: '1px solid #efefef',
      },
    },
  },
}));
