import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';
import asArray from 'src/core/utils/asArray';
import { useCourseQuery } from 'src/graphql';

import Course from './Course';

const CourseContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    semester: semester_ids,
    difficulty: difficulties,
    rating: ratings,
  } = useQueryParams<{
    [QueryParam.Semester]: string[];
    [QueryParam.Difficulty]: string[];
    [QueryParam.Rating]: string[];
  }>();
  const { data } = useCourseQuery({
    variables: {
      id,
      semester_ids: asArray<string>(semester_ids),
      difficulties: asArray<string>(difficulties).map((x) => Number(x)),
      ratings: asArray<string>(ratings).map((x) => Number(x)),
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <>
      <Helmet title={id}>
        {data?.course && <meta name="description" content={data.course.name} />}
      </Helmet>
      {data?.course ? <Course course={data.course} /> : null}
    </>
  );
};

export default CourseContainer;
