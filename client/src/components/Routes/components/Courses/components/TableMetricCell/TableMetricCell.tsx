import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useContext } from 'react';
import { FeaturesContext } from 'src/components/Features';
import { Nullable } from 'src/core';
import { CourseMetric, Stats } from 'src/graphql';

export type MetricCellType =
  | keyof Omit<CourseMetric['reviews'], '__typename'>
  | 'semesters';

export type MetricCellValue = number | Stats | string[] | undefined;

function getValue(
  type: MetricCellType,
  metric?: Nullable<CourseMetric>,
): MetricCellValue {
  switch (type) {
    case 'count':
      return metric?.reviews.count;
    case 'difficulty':
    case 'rating':
    case 'workload':
      return metric?.reviews[type];
    case 'semesters':
      return metric?.semesters;
  }
}

interface Props extends TableCellProps {
  type: MetricCellType;
  metric?: Nullable<CourseMetric>;
  feature?: 'all.reviews' | 'metrics';
  center?: boolean;
}

const MetricTableCell: React.FC<Props> = ({
  type,
  metric,
  feature,
  center,
  children,
  ...rest
}) => {
  const value = getValue(type, metric);

  const { isEnabled } = useContext(FeaturesContext);
  const mayNotSee = feature != null && !isEnabled(feature);

  const cell = (
    <TableCell {...rest} align={center ? 'center' : undefined}>
      {value == null ? '' : mayNotSee ? '?' : children}
    </TableCell>
  );

  return mayNotSee && value != null ? (
    <Tooltip title="This feature requires a Premium subscription">
      {cell}
    </Tooltip>
  ) : (
    cell
  );
};

export default MetricTableCell;
