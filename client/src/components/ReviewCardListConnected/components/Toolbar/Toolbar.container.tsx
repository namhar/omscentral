import React, { useMemo } from 'react';
import { reviewMeta } from 'src/constants/reviewMeta';
import { semesterMeta } from 'src/constants/semesterMeta';
import { Option, QueryParam, ReviewSortKey as SortKey } from 'src/core';
import useCurrentCourses from 'src/core/hooks/useCurrentCourses';
import useQueryParams from 'src/core/hooks/useQueryParams';
import { useCoursesQuery, useSemestersQuery } from 'src/graphql';

import Toolbar, { Props as ChildProps } from './Toolbar';

type Props = Omit<
  ChildProps,
  | 'courseFilterOptions'
  | 'semesterFilterOptions'
  | 'difficultyFilterOptions'
  | 'ratingFilterOptions'
  | 'sortKeyOptions'
>;

const sortKeyOptions = [
  { value: SortKey.Semester, label: 'Semester' },
  { value: SortKey.Created, label: 'Created' },
];

const difficultyFilterOptions: Option<number>[] = [...reviewMeta.difficulty];

const ratingFilterOptions: Option<number>[] = [...reviewMeta.rating];

const ToolbarContainer: React.FC<Props> = (props) => {
  const { query } = useQueryParams<{ [QueryParam.Query]: string }>();
  const currentCourses = useCurrentCourses();

  const courses = useCoursesQuery();
  const semesters = useSemestersQuery();

  const courseFilterOptions: Option[] = (courses.data?.courses ?? []).map(
    (course) => ({
      value: course.id,
      label: `${course.id} ${course.name}`,
    }),
  );

  const currentCoursesSemesters = new Set<string>(
    currentCourses.reduce<string[]>(
      (ids, course) => [...ids, ...(course.metric?.semesters ?? [])],
      [],
    ),
  );

  const semesterFilterOptions: Option[] = (semesters.data?.semesters ?? [])
    .filter(
      (semester) =>
        !currentCourses.length || currentCoursesSemesters.has(semester.id),
    )
    .map((semester) => ({
      value: semester.id,
      label: semesterMeta.translateSeason(semester.season),
    }));

  const rest = useMemo(
    () =>
      query
        ? {
            courseFilterOptions: [],
            semesterFilterOptions: [],
            difficultyFilterOptions: [],
            ratingFilterOptions: [],
            sortKeyOptions,
          }
        : {
            courseFilterOptions,
            semesterFilterOptions,
            difficultyFilterOptions,
            ratingFilterOptions,
            sortKeyOptions,
          },
    [query, courseFilterOptions, semesterFilterOptions],
  );

  return <Toolbar {...props} {...rest} />;
};

export default ToolbarContainer;
