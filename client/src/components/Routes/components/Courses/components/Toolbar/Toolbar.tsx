import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import { Nullable } from 'src/core';
import { Specialization } from 'src/graphql';

import KeywordFilter from './components/KeywordFilter/KeywordFilter';
import SpecializationSelect from './components/SpecializationSelect';
import { useStyles } from './Toolbar.styles';

interface Props {
  specializations?: Specialization[];
  specialization?: Specialization;
  onSpecializationChange: (changeTo: Nullable<Specialization>) => void;
  filter: string;
  onFilterChange: (changeTo: string) => void;
}

const Toolbar: React.FC<Props> = ({
  specializations,
  specialization,
  onSpecializationChange,
  filter,
  onFilterChange,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <SpecializationSelect
            className={classes.specializations}
            options={specializations}
            value={specialization}
            onChange={onSpecializationChange}
          />
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} lg={6} />
        </Hidden>
        <Grid item xs={12} sm={6} lg={3}>
          <KeywordFilter
            className={classes.filter}
            value={filter}
            onChange={onFilterChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Toolbar;
