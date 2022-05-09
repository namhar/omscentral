import Grid from '@material-ui/core/Grid';
import MaterialPaper from '@material-ui/core/Paper';
import MUITable, { Size } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useMemo, useState } from 'react';
import { CourseColumnKey as ColumnKey, SortDirection } from 'src/core';
import compare from 'src/core/utils/compare';
import stableSort from 'src/core/utils/stableSort';
import { Course, Semester } from 'src/graphql';

import HeadCell from '../HeadCell';
import SemesterHistory from '../SemesterHistory';
import Stats from '../Stats';
import TableMetricCell from '../TableMetricCell';
import { useStyles } from './Table.styles';

const columns = [
  ColumnKey.Id,
  ColumnKey.Name,
  // ColumnKey.Foundational,
  // ColumnKey.Deprecated,
  ColumnKey.Reviews,
  ColumnKey.Difficulty,
  ColumnKey.Workload,
  ColumnKey.Rating,
  ColumnKey.Semesters,
];

export interface Props {
  before?: React.ReactElement<any>;
  courses: Course[];
  semesters: Semester[];
  onClick: (course: Course) => void;
  size: Size;
}

const Table: React.FC<Props> = ({
  before,
  courses,
  semesters,
  onClick,
  size,
}) => {
  const classes = useStyles();

  const [orderBy, setOrderBy] = useState<ColumnKey>(ColumnKey.Id);
  const [order, setOrder] = useState<SortDirection>('asc');

  const handleHeadCellClick = (id: ColumnKey) => {
    const isDesc = orderBy === id && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(id);
  };

  const sortBy: (a: Course, b: Course) => number = useMemo(
    () =>
      order === 'desc'
        ? (a, b) => -comparator(a, b, orderBy)
        : (a, b) => +comparator(a, b, orderBy),
    [order, orderBy],
  );

  return (
    <Grid container>
      {before}
      <TableContainer component={MaterialPaper}>
        <MUITable className={classes.table} size={size} aria-label="courses">
          <TableHead>
            <TableRow>
              {columns.map((key) => (
                <HeadCell
                  key={key}
                  id={key}
                  onClick={() => handleHeadCellClick(key)}
                  order={order}
                  orderBy={orderBy}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>No matches...</TableCell>
              </TableRow>
            )}
            {stableSort(courses, sortBy).map((course) => (
              <TableRow key={course.id} onClick={() => onClick(course)} hover>
                <TableCell>{`${course.department}-${course.number}`}</TableCell>
                <TableCell className={classes.name}>
                  {course.name}
                  &nbsp;
                  {course.foundational && <sup>f</sup>}
                  {course.deprecated && <sup>d</sup>}
                </TableCell>
                <TableMetricCell
                  center
                  type="count"
                  metric={course.metric}
                  feature={course.id !== 'CS-6035' ? 'all.reviews' : undefined}
                >
                  {course.metric?.reviews?.count}
                </TableMetricCell>
                <TableMetricCell
                  center
                  type="difficulty"
                  metric={course.metric}
                  feature={course.id !== 'CS-6035' ? 'metrics' : undefined}
                >
                  <Stats {...course.metric?.reviews?.difficulty} />
                </TableMetricCell>
                <TableMetricCell
                  center
                  type="workload"
                  metric={course.metric}
                  feature={course.id !== 'CS-6035' ? 'metrics' : undefined}
                >
                  <Stats {...course.metric?.reviews?.workload} />
                </TableMetricCell>
                <TableMetricCell
                  center
                  type="rating"
                  metric={course.metric}
                  feature={course.id !== 'CS-6035' ? 'metrics' : undefined}
                >
                  <Stats {...course.metric?.reviews?.rating} />
                </TableMetricCell>
                <TableMetricCell
                  center
                  type="semesters"
                  metric={course.metric}
                  feature={course.id !== 'CS-6035' ? 'metrics' : undefined}
                >
                  <SemesterHistory
                    semesters={semesters}
                    history={course.metric?.semesters || []}
                  />
                </TableMetricCell>
              </TableRow>
            ))}
          </TableBody>
        </MUITable>
      </TableContainer>
    </Grid>
  );
};

export default Table;

const comparator = (a: Course, b: Course, orderBy: ColumnKey): number => {
  const aMetric = a.metric?.reviews;
  const bMetric = b.metric?.reviews;

  switch (orderBy) {
    case ColumnKey.Id:
      return compare(a.id, b.id);
    case ColumnKey.Name:
      return compare(a.name, b.name);
    case ColumnKey.Foundational:
      return compare(a.foundational, b.foundational);
    case ColumnKey.Deprecated:
      return compare(a.deprecated, b.deprecated);
    case ColumnKey.Reviews:
      return compare(aMetric?.count, bMetric?.count);
    case ColumnKey.Difficulty:
      return compare(aMetric?.difficulty.mean, bMetric?.difficulty.mean);
    case ColumnKey.Workload:
      return compare(aMetric?.workload.mean, bMetric?.workload.mean);
    case ColumnKey.Rating:
      return compare(aMetric?.rating.mean, bMetric?.rating.mean);
    case ColumnKey.Semesters:
    default:
      return 0;
  }
};
