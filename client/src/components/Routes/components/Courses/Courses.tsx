import { logEvent } from '@firebase/analytics';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import Banner from 'src/components/Banner';
import { FirebaseContext } from 'src/components/Firebase';
import Link from 'src/components/Link';
import Loading from 'src/components/Loading';
import { NotificationContext } from 'src/components/Notification';
import Paper from 'src/components/Paper';
import { paths, urls } from 'src/constants';
import { Nullable } from 'src/core';
import useSpecializationCourses from 'src/core/hooks/useSpecializationCourses';
import useLocal from 'src/core/utils/useLocalStorage';
import useSession from 'src/core/utils/useSessionStorage';
import { Course, Semester, Specialization } from 'src/graphql';

import Requirement from './components/Requirement';
import Table from './components/Table';
import Toggle from './components/Toggle';
import Toolbar from './components/Toolbar';
import { useStyles } from './Courses.styles';

interface Props {
  loading?: boolean;
  courses?: Course[];
  semesters?: Semester[];
  onSpecializationChange: (changeTo: Nullable<Specialization>) => void;
  specialization?: Specialization;
  specializations?: Specialization[];
  isUnreviewedShown: boolean;
  onIsUnreviewedShownChange: (isShown: boolean) => void;
  isDeprecatedShown: boolean;
  onIsDeprecatedShownChange: (isShown: boolean) => void;
  isNonFoundationalShown: boolean;
  onIsNonFoundationalShownChange: (isShown: boolean) => void;
}

const Courses: React.FC<Props> = ({
  loading,
  courses,
  semesters,
  onSpecializationChange,
  specialization,
  specializations,
  isUnreviewedShown,
  onIsUnreviewedShownChange,
  isDeprecatedShown,
  onIsDeprecatedShownChange,
  isNonFoundationalShown,
  onIsNonFoundationalShownChange,
}) => {
  const classes = useStyles();
  const sm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const history = useHistory();
  const notification = useContext(NotificationContext)!;
  const firebase = useContext(FirebaseContext);
  const [filter, setFilter] = useSession('/c:f', '');
  const [size, setSize] = useLocal<'small' | 'medium'>('/c:s', 'medium');

  useEffect(() => {
    sm && setSize('small');
  }, [sm, setSize]);

  const bySpec = useSpecializationCourses(specializations);

  const filterBy: (course: Course) => boolean = useMemo(
    () => (course) =>
      (!specialization || bySpec.get(specialization.id)!.has(course.id)) &&
      (!filter ||
        [course.id, course.department, course.name, ...course.aliases]
          .join(' ')
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase())),
    [filter, specialization, bySpec],
  );

  const filtered = useMemo(
    () => (courses || []).filter(filterBy),
    [courses, filterBy],
  );

  const handleCourseClick = (course: Course) => {
    if (course.metric?.reviews.count == null) {
      notification.warning('There are no reviews for this course.');
    } else {
      logEvent(firebase.analytics, 'select_content', {
        content_type: 'course',
        content_id: course.id,
      });
      history.push(paths.course(course.id));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main" maxWidth="xl" data-cy="courses">
      <Paper>
        <Banner />
        <Toolbar
          specializations={specializations}
          specialization={specialization}
          onSpecializationChange={onSpecializationChange}
          filter={filter}
          onFilterChange={setFilter}
        />
        {specialization != null && (
          <Alert severity="warning" className={classes.alert}>
            Refer to <Link to={urls.degreeaudit}>degreeaudit.gatech.edu</Link>{' '}
            for the definitive list of courses required for this specialization.
            Please report any issues or inaccuracies{' '}
            <Link to={urls.bugs}>here</Link>.
          </Alert>
        )}
        {specialization ? (
          specialization.requirements.map((requirement, i) => (
            <Table
              before={
                <Requirement index={i} requirement={requirement} size={size} />
              }
              courses={filtered.filter((course) =>
                requirement.courses.includes(course.id),
              )}
              semesters={semesters || []}
              key={i}
              onClick={handleCourseClick}
              size="small"
            />
          ))
        ) : (
          <Table
            courses={filtered}
            semesters={semesters || []}
            onClick={handleCourseClick}
            size="small"
          />
        )}
        <Grid container spacing={2} className={classes.toggles}>
          <Grid item sm={12}>
            <Toggle
              label="Show unreviewed?"
              value={isUnreviewedShown}
              onChange={onIsUnreviewedShownChange}
            />
          </Grid>
          <Grid item sm={12}>
            <Toggle
              label={
                <span>
                  Show deprecated? <sup>d</sup>
                </span>
              }
              value={isDeprecatedShown}
              onChange={onIsDeprecatedShownChange}
            />
          </Grid>
          <Grid item sm={12}>
            <Toggle
              label={
                <span>
                  Show non-foundational? <sup>f</sup>
                </span>
              }
              value={isNonFoundationalShown}
              onChange={onIsNonFoundationalShownChange}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Courses;
