import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import round from 'src/core/utils/round';
import { Course } from 'src/graphql';

import { useStyles } from './Metrics.styles';

interface Props {
  className?: string;
  course: Course;
}

const Metrics: React.FC<Props> = ({ className, course: { metric } }) => {
  const classes = useStyles();

  const data: {
    label: string;
    title: string;
    value: number;
    min?: number;
    max?: number;
  }[] = [
    {
      label: 'Reviews',
      value: metric?.reviews.count ?? 0,
      title: 'Number of reviews',
    },
    {
      label: 'Avg. Difficulty',
      value: metric?.reviews.difficulty.mean ?? 0,
      min: metric?.reviews.difficulty.min ?? 0,
      max: metric?.reviews.difficulty.max ?? 0,
      title: '1-Very Easy, 5-Very Hard',
    },
    {
      label: 'Avg. Workload',
      value: metric?.reviews.workload.mean ?? 0,
      min: metric?.reviews.workload.min ?? 0,
      max: metric?.reviews.workload.max ?? 0,
      title: 'Hours per week',
    },
    {
      label: 'Avg. Rating',
      value: metric?.reviews.rating.mean ?? 0,
      min: metric?.reviews.rating.min ?? 0,
      max: metric?.reviews.rating.max ?? 0,
      title: '1-Strongly Disliked, 5-Strongly Liked',
    },
  ];

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <Grid container>
          {data.map(({ label, value, title, min = 0, max = 0 }) => (
            <Grid
              item
              xs={12}
              md={3}
              key={label}
              className={classes.metric}
              style={{
                paddingBottom: data.some(({ max = 0 }) => max > 0) ? 0 : 8,
              }}
            >
              <Tooltip title={title} placement="top">
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {value !== 0 ? round(value, 2) : '?'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {min > 0 && max > 0 ? (
                      <Slider
                        defaultValue={value}
                        min={min}
                        max={max}
                        disabled
                      />
                    ) : (
                      <small>&mdash;</small>
                    )}
                  </Grid>
                </Grid>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Metrics;
