import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Option } from 'src/core';

import FilterButtonTray from '../FilterButtonTray/FilterButtonTray';
import { useStyles } from './DifficultyFilter.styles';

interface Props {
  options: Option<number>[];
  initialValues: number[];
  onSubmit: (difficulties: number[]) => void;
}

const DifficultyFilter: React.FC<Props> = ({
  options,
  initialValues,
  onSubmit,
}) => {
  const classes = useStyles();

  const [values, setValues] = useState<Set<number>>(new Set(initialValues));

  const isDifficultyChecked = (difficulty: number) => values.has(difficulty);

  const toggleDifficulty = (difficulty: number, off = false) => {
    if (isDifficultyChecked(difficulty) || off) {
      const newValues = new Set(values);
      newValues.delete(difficulty);
      setValues(newValues);
    } else {
      setValues(new Set(values).add(difficulty));
    }
  };

  const handleDifficultyClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const difficulty = Number(event.currentTarget.dataset['id']);
    if (difficulty != null) {
      toggleDifficulty(difficulty);
    }
  };

  const handleDifficultyCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const difficulty = Number(event.currentTarget.id);
    toggleDifficulty(difficulty, !event.currentTarget.checked);
  };

  const handleClear = () => {
    setValues(new Set());
  };

  const handleSubmit = () => {
    onSubmit(Array.from(values));
  };

  return (
    <>
      <Paper className={classes.container} elevation={0}>
        <FormGroup>
          {options.map(({ value, label }) => (
            <List key={value} dense disablePadding>
              <ListItem
                data-id={value}
                dense
                button
                onClick={handleDifficultyClick}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`${value}`}
                      className={clsx(classes.checkbox, classes.checkboxMain)}
                      disableRipple
                      color="primary"
                      checked={values.has(value)}
                      onChange={handleDifficultyCheckboxChange}
                    />
                  }
                  label={
                    <Typography className={classes.bold}>{label}</Typography>
                  }
                />
              </ListItem>
            </List>
          ))}
        </FormGroup>
      </Paper>

      <Divider variant="fullWidth" />

      <FilterButtonTray onClear={handleClear} onSubmit={handleSubmit} />
    </>
  );
};

export default DifficultyFilter;
