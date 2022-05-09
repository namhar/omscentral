import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Nullable } from 'src/core';
import useLocal from 'src/core/utils/useLocalStorage';
import {
  Specialization,
  useCoursesQuery,
  useSemestersQuery,
  useSpecializationsQuery,
} from 'src/graphql';

import Courses from './Courses';

const CoursesContainer: React.FC = () => {
  const [specializationId, setSpecializationId] = useLocal<Nullable<string>>(
    '/c:sid',
    null,
  );
  const [isUnreviewedShown, setIsUnreviewedShown] = useLocal<boolean>(
    '/c:us',
    false,
  );
  const [isDeprecatedShown, setIsDeprecatedShown] = useLocal<boolean>(
    '/c:ds',
    false,
  );
  const [isNonFoundationalShown, setIsNonFoundationalShown] = useLocal<boolean>(
    '/c:nf',
    true,
  );

  const courses = useCoursesQuery({ fetchPolicy: 'no-cache' });
  const semesters = useSemestersQuery();
  const specializations = useSpecializationsQuery();

  const handleSpecializationChange = (
    specialization: Nullable<Specialization>,
  ) => {
    const id = specialization?.id || null;
    setSpecializationId(id);
    setIsUnreviewedShown(!!id);
    setIsDeprecatedShown(!!id);
    setIsNonFoundationalShown(!!id);
  };

  const specialization = specializations.data?.specializations?.find(
    ({ id }) => id === specializationId,
  );

  const filteredCourses = useMemo(() => {
    if (isDeprecatedShown && isUnreviewedShown) {
      return courses.data?.courses;
    }
    return courses.data?.courses.filter((course) => {
      const unreviewedCheck =
        isUnreviewedShown || course.metric?.reviews.count != null;
      const deprecatedCheck = isDeprecatedShown || !course.deprecated;
      const foundationalCheck = isNonFoundationalShown || course.foundational;
      return Boolean(unreviewedCheck && deprecatedCheck && foundationalCheck);
    });
  }, [
    courses.data?.courses,
    isDeprecatedShown,
    isUnreviewedShown,
    isNonFoundationalShown,
  ]);

  return (
    <>
      <Helmet title="Courses">
        <meta
          name="description"
          content="Course reviews for Georgia Tech's OMSCS, OMSCyber, &amp; OMSA programs."
        />
      </Helmet>
      <Courses
        courses={filteredCourses}
        semesters={semesters.data?.semesters}
        specialization={specialization}
        onSpecializationChange={handleSpecializationChange}
        specializations={specializations.data?.specializations}
        loading={courses.loading || specializations.loading}
        isUnreviewedShown={isUnreviewedShown}
        onIsUnreviewedShownChange={setIsUnreviewedShown}
        isDeprecatedShown={isDeprecatedShown}
        onIsDeprecatedShownChange={setIsDeprecatedShown}
        isNonFoundationalShown={isNonFoundationalShown}
        onIsNonFoundationalShownChange={setIsNonFoundationalShown}
      />
    </>
  );
};

export default CoursesContainer;
